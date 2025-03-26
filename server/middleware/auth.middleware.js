import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header('Authorization');

  // Check if the header is missing or doesn't start with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = { userId: decoded.userId };
    // Verify the token using the JWT_SECRET from the environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // If token is invalid or expired, return an error response
    res.status(401).json({ message: 'Invalid or expired token' });
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateToken;
