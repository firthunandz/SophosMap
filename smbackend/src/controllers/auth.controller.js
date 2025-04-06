const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

// Configuración
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiration = '8h';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    jwtSecret,
    { expiresIn: tokenExpiration }
  );
};

const userLogin = async (req, res) => {
  const { identifier, password } = req.body;
  
  try {
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Usuario/email y contraseña son requeridos' });
    }

    // Buscar usuario
    const userResult = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $1', 
      [identifier]
    );
    
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Actualizar último login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    // Generar token
    const token = generateToken(user);
    const { password_hash, ...userData } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userData,
      expiresIn: tokenExpiration
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const userRegister = async (req, res) => {
  const { nickname, username, email, password } = req.body;
  
  try {
    // Validaciones
    if (!nickname || !username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Verificar usuario/email existente
    const userExists = await query(
      'SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1',
      [username, email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario o email ya están registrados' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const newUser = await query(
      `INSERT INTO users 
       (nickname, username, email, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, nickname, role, created_at`,
      [nickname, username, email, passwordHash]
    );

    // Generar token automáticamente
    const token = generateToken(newUser.rows[0]);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: newUser.rows[0],
      expiresIn: tokenExpiration
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

module.exports = {
  userLogin,
  userRegister,
};