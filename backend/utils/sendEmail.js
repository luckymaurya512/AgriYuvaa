import nodemailer from "nodemailer";

let transporter = null;

/** Lazily create the transporter with robust timeouts and Gmail service support */
const getTransporter = () => {
  if (!transporter) {
    const isGmail = process.env.SMTP_HOST?.includes("gmail") || process.env.SMTP_USER?.includes("@gmail.com");
    
    const transportConfig = isGmail
      ? {
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS?.replace(/\s+/g, ""), // remove any spaces from App Password
          },
          connectionTimeout: 10000, // 10s timeout instead of hanging 2 min
          greetingTimeout: 10000,
          socketTimeout: 15000,
        }
      : {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS?.replace(/\s+/g, ""),
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        };

    transporter = nodemailer.createTransport(transportConfig);
  }
  return transporter;
};

/**
 * Send an email using the configured SMTP transporter.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"AgriYuvaa" <${process.env.SMTP_USER || "no-reply@agriyuvaa.com"}>`,
    to,
    subject,
    html,
  };

  await getTransporter().sendMail(mailOptions);
};

export default sendEmail;
