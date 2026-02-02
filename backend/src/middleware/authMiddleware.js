const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id };
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
