import nodemailer from "nodemailer";

let transporter = null;

/** Lazily create the transporter so env vars are available (after dotenv.config()) */
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Send an email using the configured SMTP transporter.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"AgriYuvaa" <no-reply@agriyuvaa.com>',
    to,
    subject,
    html,
  };

  await getTransporter().sendMail(mailOptions);
};

export default sendEmail;
