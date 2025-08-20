const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html }) {
  const hasSmtp = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
  const hasGmail = !!process.env.GMAIL_USER && !!process.env.GMAIL_PASS;

  if (!hasSmtp && !hasGmail) {
    throw new Error('No SMTP credentials found (set SMTP_* or GMAIL_* envs)');
  }

  let transporter;
  if (hasSmtp) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });
  }

  const from = process.env.MAIL_FROM || process.env.GMAIL_USER || process.env.SMTP_USER;
  await transporter.sendMail({ from, to, subject, html });
}

module.exports = sendEmail;
