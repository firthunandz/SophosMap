require('dotenv').config()
const jwt = require('jsonwebtoken'); // <-- ¡Agrega esta línea al inicio!
const pool = require('../database/connection');

// Middleware para verificar JWT (para usar en otras rutas)
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario aún existe en la DB
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.id]);
    
    if (!user.rows[0]) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Añadir datos del usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;