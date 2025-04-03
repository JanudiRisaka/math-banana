// This middleware verifies the JWT from the request cookies and attaches user info to the request.
import jwt from "jsonwebtoken";
import 'dotenv/config';

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

     // Check if token exists
    if (!token) {
        return res.json({success: false, message: 'Not Authorized. Login Again'});
    }

    try {
        // Verify the token using the secret
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request if valid
        if(tokenDecode.userId) {
            req.user = { userId: tokenDecode.userId };
        } else {
            return res.json({success: false, message: 'Invalid token format'});
        }

        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default userAuth;