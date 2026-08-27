import { Resend } from "resend";
import nodemailer from "nodemailer";

let resendClient = null;
let transporter = null;

const getResend = () => {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

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
 * Send an email via Resend (HTTPS port 443 - works seamlessly on Render/cloud)
 * with automatic fallback to Nodemailer SMTP if RESEND_API_KEY is not set.
 * 
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  // 1. Prefer Resend if API key is provided (never blocked by cloud firewalls)
  if (process.env.RESEND_API_KEY) {
    const resend = getResend();
    const fromAddress = process.env.EMAIL_FROM || "AgriYuvaa <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message || "Failed to send email via Resend");
    }

    return data;
  }

  // 2. Fallback to Nodemailer SMTP
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"AgriYuvaa" <${process.env.SMTP_USER || "no-reply@agriyuvaa.com"}>`,
    to,
    subject,
    html,
  };

  await getNodemailerTransporter().sendMail(mailOptions);
};

export default sendEmail;
