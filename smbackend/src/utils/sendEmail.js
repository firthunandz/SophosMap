const sgMail = require('@sendgrid/mail');

const sendEmail = async ({ to, subject, html }) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: `"Sophos Map" <${process.env.SENDGRID_SENDER}>`,
      subject,
      html
    };

    const info = await sgMail.send(msg);

    console.log('Correo enviado:', { to, subject, response: info[0].statusCode });

    return info;
  } catch (err) {
    console.error('Error al enviar el correo:', err);
    if (err.response) {
      console.error('Detalles del error:', err.response.body);
    }
    throw new Error('No se pudo enviar el correo');
  }
};

module.exports = sendEmail;