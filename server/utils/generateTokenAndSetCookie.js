import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});
	console.log(token);

	res.cookie("jwt", token, {
		httpOnly: false,
		maxAge: 15 * 24 * 60 * 60 * 1000,
		sameSite: "lax",
	});

	return token;
};

export default generateTokenAndSetCookie;
