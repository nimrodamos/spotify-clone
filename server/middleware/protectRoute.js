import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Token not found." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};


export default protectRoute;
