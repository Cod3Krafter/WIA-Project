import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to, firstName, verificationUrl) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Please verify your email address",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome ${firstName}!</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
