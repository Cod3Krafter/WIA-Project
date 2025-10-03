import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { registerUserSchema, getUserSchema, loginUserSchema } from '../schemas/authInputValidation.js';
import { sendVerificationEmail } from "../utils/mailer.js";

dotenv.config();

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
    const { rows: existing } = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Insert new user
    const { rows } = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, bio, profile_picture, email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [first_name, last_name, email, hashedPassword, bio, profile_picture, false]
    );
    const userId = rows[0].id;

    // Insert roles
    for (const role of roles) {
      if (!["client", "freelancer"].includes(role)) {
        return res.status(400).json({ message: `Invalid role: ${role}` });
      }
      await db.query(
        `INSERT INTO user_roles (user_id, role) VALUES ($1, $2)`,
        [userId, role]
      );
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

    await sendVerificationEmail(email, first_name, verificationUrl);

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

    const { rows: users } = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [decoded.id]
    );
    const user = users[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.email_verified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    await db.query(
      "UPDATE users SET email_verified = true WHERE id = $1",
      [user.id]
    );

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

    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.email_verified) {
      return res.status(200).json({ message: "Email already verified. You can log in." });
    }

    const verificationToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.VERIFICATION_TOKEN,
      { expiresIn: "15m" }
    );

    const client_url =
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173";

    const verificationUrl = `${client_url}/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(user.email, user.first_name, verificationUrl);

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
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.email_verified) {
      return res.status(401).json({ 
        message: "Please verify your email before logging in.",
        emailVerificationRequired: true
      });
    }

    const { rows: roleRows } = await db.query(
      "SELECT role FROM user_roles WHERE user_id = $1",
      [user.id]
    );
    const roles = roleRows.map(r => r.role);

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

export async function getUser(req, res) {
  try {
    const { id } = req.user;
    await getUserSchema.validate({ id });

    const db = await connectDB();
    const { rows } = await db.query(
      "SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1",
      [id]
    );
    const user = rows[0];

    res.status(200).json({ message: "User data retrieved successfully", user });
  } catch (error) {
    console.error("Error in getUser controller:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export function logoutUser(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
}
