require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../database/connection');
const sendEmail = require('../utils/sendEmail');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiration = '15m';
const refreshExpiration = '30d';

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
    { expiresIn: refreshExpiration }
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
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Refresh token expirado' });
    }

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
      maxAge: 30 * 24 * 60 * 60 * 1000
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

    sendVerificationEmail(newUser.rows[0], res);

    res.status(201).json({
      message: 'Usuario registrado exitosamente. Verifica tu correo para completar el registro.',
      user: newUser.rows[0]
    });

    // const token = generateToken(newUser.rows[0]);

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Strict',
    //   maxAge: 30 * 24 * 60 * 60 * 1000
    // });

    // res.status(201).json({
    //   message: 'Usuario registrado exitosamente',
    //   token,
    //   user: newUser.rows[0],
    //   expiresIn: tokenExpiration
    // });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 60 * 60 * 1000);

    await query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [token, expiration, email]
    );

    const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${email}`;
    const message = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>Hola ${user.nickname || user.username},</h2>
        <p>Has solicitado restablecer tu contraseña en <strong>Sophos Map</strong>.</p>
        <p>Hacé clic en el siguiente botón para crear una nueva contraseña:</p>
        <p>
          <a href="${resetLink}" style="background-color: #b88e2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
          </a>
        </p>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <hr/>
        <p style="font-size: 0.9em; color: #888;">
          Si vos no solicitaste este cambio, ignorá este mensaje. El enlace expirará en 1 hora.
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: 'Recuperación de contraseña - Sophos Map',
      html: message
    });

    res.json({ message: 'Enlace para restablecer la contraseña enviado al correo electrónico' });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND reset_token = $2 AND reset_token_expires > NOW()',
      [email, token]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    res.json({ message: 'Contraseña restablecida correctamente' });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const sendVerificationEmail = (user, res) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  query(
    'UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE email = $3',
    [verificationToken, expiration, user.email]
  );

  const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}&email=${user.email}`;
  const message = `
    <div style="font-family: 'Arial', sans-serif; background-color: #f4e6c3; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #4a2c1d; font-size: 24px; font-weight: bold;">¡Bienvenido a Sophos Map, ${user.username}!</h2>
        <p style="color: #2d2d2d; font-size: 18px; line-height: 1.5;">
          Por favor, haz clic en el siguiente enlace para verificar tu correo y activar tu cuenta.
        </p>
        <p style="text-align: center; padding-top: 20px;">
          <a href="${verificationLink}" style="background-color: #b88e2f; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
            Verificar correo
          </a>
        </p>
      </div>
      <div style="text-align: center; padding-top: 30px; font-size: 14px; color: #888;">
        <p>Si no solicitaste este registro, puedes ignorar este mensaje.</p>
        <p style="font-size: 14px;">Cualquier problema, comunícate con nosotros al correo: <a href="mailto:sophosmapapp@gmail.com" style="color: #2d2d2d;">sophosmapapp@gmail.com</a></p>
        <p>Gracias,</p>
        <p><strong>El equipo de Sophos Map</strong></p>
      </div>
    </div>
  `;

  sendEmail({
    to: user.email,
    subject: 'Verificación de correo en Sophos Map',
    html: message
  }).catch(err => console.error('Error al enviar email:', err));
};

const verifyEmail = async (req, res) => {
  const { token, email } = req.query;

  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND verification_token = $2 AND verification_token_expires > NOW()',
      [email, token]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    await query(
      'UPDATE users SET verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE email = $1',
      [email]
    );

    res.json({ message: 'Correo verificado exitosamente' });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({ error: 'Error al verificar el correo' });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'Tu cuenta ya está verificada' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 60 * 60 * 1000);  // 1 hora

    await query(
      'UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE email = $3',
      [verificationToken, expiration, email]
    );

    const verificationLink = `http://localhost:5173/verify-email?token=${verificationToken}&email=${email}`;
    const message = `
      <div style="font-family: 'Arial', sans-serif; background-color: #f4e6c3; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #4a2c1d; font-size: 24px; font-weight: bold;">¡Hola ${user.username}!</h2>
          <p style="color: #2d2d2d; font-size: 18px; line-height: 1.5;">
            Recibimos una solicitud para reenviar el enlace de verificación de tu correo. Haz clic en el siguiente enlace para continuar con la activación de tu cuenta.
          </p>
          <p style="text-align: center; padding-top: 20px;">
            <a href="${verificationLink}" style="background-color: #b88e2f; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
              Verificar correo
            </a>
          </p>
        </div>
        <div style="text-align: center; padding-top: 30px; font-size: 14px; color: #888;">
          <p>Si no solicitaste este reenvío, puedes ignorar este mensaje.</p>
          <p style="font-size: 14px;">Cualquier problema, comunícate con nosotros al correo: <a href="mailto:sophosmapapp@gmail.com" style="color: #2d2d2d;">sophosmapapp@gmail.com</a></p>
          <p>Gracias,</p>
          <p><strong>El equipo de Sophos Map</strong></p>
        </div>
      </div>
    `;
  
    await sendEmail({
      to: email,
      subject: 'Verificación de correo en Sophos Map',
      html: message
    });

    res.json({ message: 'Se ha enviado un nuevo enlace de verificación a tu correo' });
  } catch (error) {
    console.error('Error al reenviar el correo de verificación:', error);
    res.status(500).json({ error: 'Error al reenviar el correo de verificación' });
  }
};

module.exports = {
  userLogin,
  userRegister,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail
};