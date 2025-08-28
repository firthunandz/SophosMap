require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool = require('../database/connection');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log(`[verifyToken] Verificando token para ${req.method} ${req.url}, Token: ${token ? 'Presente' : 'Ausente'}`);
  
  if (!token) {
    console.log('[verifyToken] Token no proporcionado');
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`[verifyToken] Token decodificado: ${JSON.stringify(decoded)}`);
    
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.id]);
    
    if (!user.rows[0]) {
      console.log(`[verifyToken] Usuario no encontrado para id ${decoded.id}`);
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = decoded;
    console.log(`[verifyToken] Token válido para usuario ${decoded.id}`);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('[verifyToken] Token expirado:', error.message);
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    console.error('[verifyToken] Error al verificar token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;