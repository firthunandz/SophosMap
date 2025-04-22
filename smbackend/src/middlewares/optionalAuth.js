const jwt = require('jsonwebtoken');
const pool = require('../database/connection');

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.id]);

    if (user.rows.length === 0) {
      return next();
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.warn('Token inválido o expirado en optionalAuth:', error.message);
    return next();
  }
};

module.exports = optionalAuth;
