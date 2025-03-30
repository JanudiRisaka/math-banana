// // utils/generateTokenAndSetCookie.js
// import jwt from "jsonwebtoken";

// // utils/generateTokenAndSetCookie.js
// export const generateTokenAndSetCookie = (res, userId) => {
// 	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
// 	  expiresIn: "7d",
// 	});

// 	res.cookie("token", token, {
// 		httpOnly: true,
// 		secure: false, // Must be false for localhost
// 		sameSite: 'lax',
// 		maxAge: 7 * 24 * 60 * 60 * 1000,
// 		path: '/',
// 		// Remove domain completely for localhost
// 	  });

// 	return token;
//   };