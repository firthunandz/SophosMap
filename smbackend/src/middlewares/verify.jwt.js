require('dotenv').config()
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.id]);
    
    if (!user.rows[0]) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;