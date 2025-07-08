import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { connectDB } from "../config/db.js"
import { registerUserSchema, getUserSchema, loginUserSchema } from '../schemas/authInputValidation.js'




export async function registerUser(req, res) {
    try {
          // Validate input
        await registerUserSchema.validate(req.body, { abortEarly: false })

        const { first_name,last_name, email, password, role, bio, profile_picture } = req.body
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const db = await connectDB()

        // SQL Query to insert new user
        const newUser = await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO users (first_name, last_name, email, password, role, bio, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [first_name,last_name, email, hashedPassword, role, bio, profile_picture],
                function(err) {
                    if (err) {
                        reject(err)
                    } else {
                        const userID = {id: this.lastID}
                        console.log("This is the users ID",userID)
                        resolve(userID)
                    }
                }
            )
        })

        // Get the created user
        const createdUser = await new Promise((resolve, reject) => {
            db.get(
                "SELECT id, first_name, last_name, email, role, bio, profile_picture, created_at FROM users WHERE id = ?",
                [newUser.id],
                (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row)
                    }
                }
            )
        })

        db.close()
        res.status(201).json(createdUser)
    } catch (error) {
        console.error("Error in the registerUser controller", error)

        // ✅ Yup validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors
            })
        }
        
        // Handle unique constraint violation for email
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: "Email already exists" })
        }
        
        res.status(500).json({ message: "Internal server error" })
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
         // Validate input
        await loginUserSchema.validate(req.body, { abortEarly: false })

        const { email, password } = req.body
        const db = await connectDB()

        // Find user by email
        const user = await new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, row) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(row)
                    }
                }
            )
        })
        db.close()
        console.log(user)

        // Check if user existsr, return ends the function if the condition is met
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // Check password (you should use bcrypt.compare() for hashed passwords)
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }else{
            // jwt payload to sign the user
            const { id, email, role } = user
            const userPayload = {id, email, role}
            const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN, {expiresIn:"15m"})

            const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN, { expiresIn: "7d" })

            // Send refresh token as HTTP-only cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use true in production (HTTPS)
                sameSite: "Strict", // or "Lax" depending on use
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })


            res.status(200).json({
                message: "Login successful",
                accessToken: accessToken,
            })
        }

    } catch (error) {
        console.error("Error in the loginUser controller", error)
         if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors
            })
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

