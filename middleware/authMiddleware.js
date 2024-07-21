const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

exports.verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('No token, authorization denied');

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send('Token is not valid');
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  next();
};

exports.isUserManagement = (req, res, next) => {
  if (req.user.role !== 'user_management') {
    return res.status(403).send('Access denied');
  }
  next();
};

exports.isUserExecution = (req, res, next) => {
  if (req.user.role !== 'user_execution') {
    return res.status(403).send('Access denied');
  }
  next();
};
