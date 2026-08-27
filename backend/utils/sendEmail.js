import nodemailer from "nodemailer";

let transporter = null;

const getNodemailerTransporter = () => {
  if (!transporter) {
    const isGmail = process.env.SMTP_HOST?.includes("gmail") || process.env.SMTP_USER?.includes("@gmail.com");
    transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: "gmail",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS?.replace(/\s+/g, ""),
            },
            connectionTimeout: 10000,
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
          }
    );
  }
  return transporter;
};

/**
 * Send an email using Brevo HTTP API (Port 443 - free 300 emails/day to any recipient),
 * with fallback to Nodemailer SMTP.
 * 
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  // 1. Brevo HTTP API (Recommended: no domain required, works anywhere on cloud)
  if (process.env.BREVO_API_KEY) {
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || "mauryalucky512@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME || "AgriYuvaa";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY.trim(),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Brevo email error: ${response.statusText}`);
    }

    return data;
  }

  // 2. Fallback to Nodemailer SMTP if configured
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"AgriYuvaa" <${process.env.SMTP_USER || "no-reply@agriyuvaa.com"}>`,
    to,
    subject,
    html,
  };

  await getNodemailerTransporter().sendMail(mailOptions);
};

export default sendEmail;
