import User from "../models/userModel.js"; 
import bcrypt from "bcryptjs";
import axios from "axios";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
    const query = req.params.query;
    
    try {
        let user;
        console.log("Query: ", query);
        
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ displayName: query }).select("-password").select("-updatedAt");
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
        const { displayName, email, password, gender, dateOfBirth } = req.body;
        
        const premium = req.body.premium || false;
        // Check if the user already exists
        let existingUser;
        try {
            existingUser = await User.findOne({ email });
        } catch (err) {
            return res.status(500).json({ error: "Error checking for existing user" });
        }
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Fetch the Spotify application access token using Client Credentials Flow
        let accessToken, expiresIn;
        try {
            const tokenResponse = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${Buffer.from(
                            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                        ).toString('base64')}`,
                    },
                }
            );

            accessToken = tokenResponse.data.access_token;
            expiresIn = tokenResponse.data.expires_in; // Store expiresIn to know when the token expires
        } catch (error) {
            console.error(
                'Error fetching Spotify application access token:',
                error.response?.data || error.message
            );
            return res.status(500).json({ error: 'Failed to fetch Spotify application access token' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in your database
        const newUser = new User({
            displayName,
            email,
            password: hashedPassword,
            gender,
            dateOfBirth,
            accessToken, // Use the appAccessToken from the client credentials flow
            refreshToken: null, // Optional: null for client credentials flow
            expiresIn, // Store expiresIn to know when the token expires
            premium, // Optional: set to true if the user has a premium account
            profilePicture: null, // You can store the profile picture URL if you want
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Generate a token and set it in a cookie
        generateTokenAndSetCookie(savedUser._id, res);

        // Send a response with user details
        res.status(201).json({
            _id: savedUser._id,
            displayName: savedUser.displayName,
            email: savedUser.email,
            gender: savedUser.gender,
            dateOfBirth: savedUser.dateOfBirth,
            accessToken: savedUser.accessToken, // Optional: send the access token in response
        });
    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid email or password" });

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in loginUser: ", error.message);
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

        if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

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
                await cloudinary.uploader.destroy(user.profilePicture.split("/").pop().split(".")[0]);
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
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Example: Check if the email exists in the database
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ valid: false, message: 'Email is already in use' });
        } else {
            return res.status(200).json({ valid: true });
        }
    } catch (error) {
        console.error('Error validating email:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};




export {
    signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile,
    upgradeToPremium,
    validateEmail,
};