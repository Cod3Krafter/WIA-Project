import sgMail from "@sendgrid/mail";
import dotenv from 'dotenv'

dotenv.config()


// Set the API key (store it in Render env vars)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendVerificationEmail(to, firstName, verificationUrl) {
  const msg = {
    to,
    from: process.env.EMAIL_USER, // must be a verified sender in SendGrid
    subject: "Please verify your email address",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Welcome ${firstName}!</h2>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;margin:20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("Verification email sent to", to);
  } catch (error) {
    console.error("Error sending verification email:", error);
    if (error.response) {
      console.error(error.response.body); // logs SendGrid error details
    }
    throw error;
  }
}
