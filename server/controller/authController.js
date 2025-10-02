import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import crypto from "crypto"
import { connectDB } from "../config/db.js"
import dotenv from 'dotenv'
import { registerUserSchema, getUserSchema, loginUserSchema } from '../schemas/authInputValidation.js'
import { sendVerificationEmail } from "../utils/mailer.js";


dotenv.config();

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})


export async function registerUser(req, res) {
  const { first_name, last_name, email, password, bio, profile_picture, roles } = req.body;

  if (!Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "At least one role must be selected." });
  }

  try {
    const db = await connectDB();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email exists
    const checkEmail = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    });

    if (checkEmail) {
      db.close();
      return res.status(400).json({ message: "Email already in use." });
    }

    // Insert new user
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (first_name, last_name, email, password, bio, profile_picture, email_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, email, hashedPassword, bio, profile_picture, false],
        function (err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    const userId = result.lastID;

    // Insert roles
    for (const role of roles) {
      if (!["client", "freelancer"].includes(role)) {
        db.close();
        return res.status(400).json({ message: `Invalid role: ${role}` });
      }
      await new Promise((resolve, reject) => {
        db.run(`INSERT INTO user_roles (user_id, role) VALUES (?, ?)`, [userId, role], err =>
          err ? reject(err) : resolve()
        );
      });
    }

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: userId, email },
      process.env.VERIFICATION_TOKEN,
      { expiresIn: "15m" }
    );

    const client_url =
      process.env.NODE_ENV !== "production"
        ? "http://localhost:5173"
        : process.env.CLIENT_URL;

    const verificationUrl = `${client_url}/verify-email?token=${verificationToken}`;

    // ✅ Use the mailer function
    await sendVerificationEmail(email, first_name, verificationUrl);

    db.close();

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Verification token is required." });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired verification token." });
    }

    const db = await connectDB();

    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [decoded.id], (err, row) =>
        err ? reject(err) : resolve(row)
      );
    });

    if (!user) {
      db.close();
      return res.status(404).json({ message: "User not found." });
    }

    if (user.email_verified) {
      db.close();
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Mark email as verified
    await new Promise((resolve, reject) => {
      db.run("UPDATE users SET email_verified = true WHERE id = ?", [user.id], err =>
        err ? reject(err) : resolve()
      );
    });

    db.close();
    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function resendVerification(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const db = await connectDB();

    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!user) {
      db.close();
      return res.status(404).json({ message: "User not found." });
    }

    if (user.email_verified) {
      db.close();
      return res.status(200).json({ message: "Email already verified. You can log in." });
    }

    // ✅ Generate new JWT verification token
    const verificationToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.VERIFICATION_TOKEN,
      { expiresIn: "15m" }
    );

    // ✅ Build verification link
    const client_url =
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173";

    const verificationUrl = `${client_url}/verify-email?token=${verificationToken}`;

    // ✅ Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Please verify your email address",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    db.close();

    res.status(200).json({ message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function loginUser(req, res) {
  try {
    await loginUserSchema.validate(req.body, { abortEarly: false });
    const { email, password } = req.body;

    const db = await connectDB();

    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!user) {
      db.close();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      db.close();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.email_verified) {
      db.close();
      return res.status(401).json({ 
        message: "Please verify your email before logging in.",
        emailVerificationRequired: true
      });
    }

    // Get all roles for this user
    const roles = await new Promise((resolve, reject) => {
      db.all(
        "SELECT role FROM user_roles WHERE user_id = ?",
        [user.id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows.map(row => row.role));
        }
      );
    });

    db.close();

    // Construct payload with all roles and a default role
    const userPayload = {
      id: user.id,
      email: user.email,
      profile_picture: user.profile_picture,
      roles,
      role: roles[0],
    };

    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN, {
      expiresIn: "15m"
    });
    
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN, {
      expiresIn: "7d"
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
    });

  } catch (error) {
    console.error("Login error:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Keep your existing getUser and logoutUser functions unchanged
export async function getUser(req, res) {
  try {
    const { id } = req.user
    await getUserSchema.validate({ id })
    
    const db = await connectDB()
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id, email, role, first_name, last_name, created_at FROM users WHERE id = ?",
        [id],
        (err, row) => {
          if (err) reject(err)
          else resolve(row)
        }
      )
    })
    
    db.close()
    res.status(200).json({ message: "User data retrieved successfully", user: user })
  } catch (error) {
    console.error("Error in getUser controller:", error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    res.status(500).json({ message: "Internal server error" })
  }
}

export function logoutUser(req, res) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production"
  })
  res.status(200).json({ message: "Logged out successfully" })
}