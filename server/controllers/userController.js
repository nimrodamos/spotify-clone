import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { getSpotifyAuthorizationCode, exchangeAuthorizationCodeForTokens } from "./spotifyController.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
  const query = req.params.query;

  try {
    let user;
    console.log("Query: ", query);

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ displayName: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const { displayName, email, password, dateOfBirth, gender, profilePicture } = req.body;

    if (!dateOfBirth || !gender) {
      return res.status(400).json({ error: "dateOfBirth and gender are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let uploadedPicture = "";
    if (profilePicture) {
      const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
      uploadedPicture = uploadedResponse.secure_url;
    }

    console.log("Fetching Spotify authorization code...");
    const authorizationCode = await getSpotifyAuthorizationCode();
    if (!authorizationCode) {
      return res.status(500).json({ error: "Failed to fetch Spotify authorization code" });
    }

    const { access_token, refresh_token, expires_in } = await exchangeAuthorizationCodeForTokens(
      authorizationCode
    );

    const newUser = new User({
      displayName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      profilePicture: uploadedPicture,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: Math.floor(Date.now() / 1000) + expires_in,
    });

    const savedUser = await newUser.save();

    generateTokenAndSetCookie(savedUser._id, res);

    res.status(201).json({
      _id: savedUser._id,
      displayName: savedUser.displayName,
      email: savedUser.email,
      profilePicture: savedUser.profilePicture,
    });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, spotifyAuthCode } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Exchange Spotify authorization code for tokens
    if (spotifyAuthCode) {
      try {
        const { access_token, refresh_token, expires_in } = await exchangeAuthorizationCodeForTokens(spotifyAuthCode);

        user.accessToken = access_token;
        user.refreshToken = refresh_token;
        user.expiresIn = Math.floor(Date.now() / 1000) + expires_in;
        await user.save();

        console.log("Spotify tokens updated during login");
      } catch (error) {
        console.error("Error refreshing Spotify tokens:", error.message);
        return res.status(500).json({ error: "Failed to refresh Spotify tokens" });
      }
    }

    // Generate a token and set it in a cookie
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      displayName: user.displayName,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: error.message });
  }
};  

const logoutUser = (res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in logoutUser: ", err.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user?._id);

    if (!req.user) return res.status(400).json({ error: "User not authenticated" });

    if (id.toString() === req.user._id.toString())
      return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};

const upgradeToPremium = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.premium = true;
    await user.save();

    res.status(200).json({ message: "User upgraded to premium successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in upgradeToPremium: ", err.message);
  }
};

const validateEmail = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ valid: false, message: "Email is already in use" });
    } else {
      return res.status(200).json({ valid: true });
    }
  } catch (error) {
    console.error("Error validating email:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  const { displayName, email, password } = req.body;
  let { profilePicture } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res.status(400).json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
      profilePicture = uploadedResponse.secure_url;
    }

    user.displayName = displayName || user.displayName;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;

    user = await user.save();

    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

export { getUserProfile, signupUser, loginUser, logoutUser, followUnFollowUser, upgradeToPremium, validateEmail, updateUser };
