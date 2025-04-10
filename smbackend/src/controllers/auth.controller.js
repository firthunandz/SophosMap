const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');

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

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const refreshToken = (req, res) => {
  const token = req.body.refreshToken;

  if (!token) return res.status(401).json({ error: 'Refresh token requerido' });

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Refresh token inválido o expirado' });

    const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = userResult.rows[0];

    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const newAccessToken = generateToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ error: 'Refresh token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    
    const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = userResult.rows[0];

    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const newAccessToken = generateToken(user);
    res.json({ token: newAccessToken, expiresIn: tokenExpiration });
  } catch (err) {
    console.error('Error al refrescar token:', err);
    res.status(403).json({ error: 'Refresh token inválido o expirado' });
  }
};

const userLogin = async (req, res) => {
  const { identifier, password } = req.body;
  
  try {
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Usuario/email y contraseña son requeridos' });
    }

    const userResult = await query(
      'SELECT * FROM users WHERE email = $1 OR username = $1', 
      [identifier]
    );
    
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const { password_hash, ...userData } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login exitoso',
      token,
      refreshToken,
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
    if (!nickname || !username || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const userExists = await query(
      'SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1',
      [username, email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario o email ya están registrados' });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await query(
      `INSERT INTO users 
       (nickname, username, email, password_hash) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, nickname, role, created_at`,
      [nickname, username, email, passwordHash]
    );

    const token = generateToken(newUser.rows[0]);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

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
  refreshAccessToken
};