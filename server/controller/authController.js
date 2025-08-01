import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { connectDB } from "../config/db.js"
import { registerUserSchema, getUserSchema, loginUserSchema } from '../schemas/authInputValidation.js'




export async function registerUser(req, res) {
  const { first_name, last_name, email, password, bio, profile_picture, roles } = req.body;

  if (!Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "At least one role must be selected." });
  }

  try {
    const db = await connectDB();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users
    const result = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (first_name, last_name, email, password, bio, profile_picture) VALUES (?, ?, ?, ?, ?, ?)`,
        [first_name, last_name, email, hashedPassword, bio, profile_picture],
        function (err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    const userId = result.lastID;

    // Insert roles into user_roles
    for (const role of roles) {
      if (!['client', 'freelancer'].includes(role)) {
        return res.status(400).json({ message: `Invalid role: ${role}` });
      }

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO user_roles (user_id, role) VALUES (?, ?)`,
          [userId, role],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}


export async function getUser(req, res) {
    try {
        // Access the authenticated user's id from req.user
        const { id } = req.user
        
        // Validate id
        await getUserSchema.validate({ id })

        // fetch fresh user data from database
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
        
        res.status(200).json({
            message: "User data retrieved successfully",
            user: user
        })
        
    } catch (error) {
        console.error("Error in getUser controller:", error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }

        res.status(500).json({ message: "Internal server error" })
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
      roles,              // array of roles: ['client', 'freelancer']
      role: roles[0],     // default active role (first one)
    };

    const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN, { expiresIn: "7d" });

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


export function logoutUser(req, res) {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
    })
    res.status(200).json({ message: "Logged out successfully" })
}

