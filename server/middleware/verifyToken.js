import jwt from "jsonwebtoken"; // Add this import at the top

  // Path filtering
  const publicPaths = [
	'/auth/signin',
	'/auth/signup',
	'/auth/verify-email',
	'/auth/check-auth',
	'/auth/maintain-session',
	'/help',
	'/'
  ];

export const verifyToken = (req, res, next) => {
	const token = req.cookies?.token;
	const isPublic = publicPaths.some(path => req.path.startsWith(path));

	if (isPublic) return next();
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization required - Please login"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(403).json({
        success: false,
        message: err.name === 'TokenExpiredError'
          ? "Session expired - Please login again"
          : "Invalid credentials"
      });
    }

    req.userId = decoded.userId;
    console.log('Authenticated user ID:', req.userId);
    next();
  });
};