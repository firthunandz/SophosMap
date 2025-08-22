const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('Configurando transporte de correo...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '***' : 'No definido');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      connectionTimeout: 10000, // 10 seg
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: true,
      debug: process.env.NODE_ENV !== 'production'
    });

    const mailOptions = {
      from: `"Sophos Map" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    };

    console.log('Enviando correo a:', to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error al enviar el correo:', err);
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = sendEmail;