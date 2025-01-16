import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    let token;

    // בדוק אם הטוקן נמצא בכותרת Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      // אם לא, בדוק אם הוא נמצא ב-cookie
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in protectRoute: ", err.message);
  }
};

export default protectRoute;
