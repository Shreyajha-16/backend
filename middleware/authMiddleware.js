const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Authorize middleware to check user role
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

const cors = require('cors');

const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-url.vercel.app'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


module.exports = { protect, authorize };
