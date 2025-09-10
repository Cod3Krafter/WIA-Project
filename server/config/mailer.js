import bycrpt from 'bcrypt'
import nodemailer from "nodemailer"
import dotent from 'dotenv'

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})