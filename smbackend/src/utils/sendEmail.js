const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log('Configurando transporte de correo...');
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
      connectionTimeout: 25000, // 25 seg
      greetingTimeout: 25000,
      socketTimeout: 25000,
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