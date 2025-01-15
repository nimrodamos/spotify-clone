import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // זמן תפוגה של הטוקן
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // secure רק בפרודקשן
    sameSite: "strict",
    maxAge: 3600000, // שעה אחת
  });

  return token; // החזרת הטוקן
};

export default generateTokenAndSetCookie;
