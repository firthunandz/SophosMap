const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/test-smtp', async (req, res) => {
  try {
    console.log('Probando conexión SMTP...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '***' : 'No definido');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      connectionTimeout: 25000,
      greetingTimeout: 25000,
      socketTimeout: 25000,
      logger: true,
      debug: process.env.NODE_ENV !== 'production'
    });

    console.log('Verificando conexión SMTP...');
    await transporter.verify();
    console.log('Conexión SMTP exitosa');
    res.json({ message: 'Conexión SMTP exitosa' });
  } catch (err) {
    console.error('Error en conexión SMTP:', err);
    res.status(500).json({ error: 'Error en conexión SMTP', details: err.message });
  }
});

module.exports = router;