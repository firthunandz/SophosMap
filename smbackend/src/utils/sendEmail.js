const nodemailer = require('nodemailer');

function buildTransport() {
  const {
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
    GMAIL_USER, GMAIL_PASS, NODE_ENV
  } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: String(SMTP_PORT || '587') === '465',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: NODE_ENV === 'production' ? {} : { rejectUnauthorized: false },
    });
  }

  if (GMAIL_USER && GMAIL_PASS) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
  }

  throw new Error('No SMTP credentials found (set SMTP_* or GMAIL_* envs)');
}

const transporter = buildTransport();

async function sendEmail({ to, subject, html, text }) {
  const from =
    process.env.MAIL_FROM ||
    (process.env.SMTP_USER
      ? `"Sophos Map" <${process.env.SMTP_USER}>`
      : process.env.GMAIL_USER
      ? `"Sophos Map" <${process.env.GMAIL_USER}>`
      : undefined);

  return transporter.sendMail({ from, to, subject, html, text });
}

module.exports = sendEmail;

