// testEmailConfig.js - Run this script to test your email setup
console.log("🚀 Script started")

import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n')

  // Check environment variables
  console.log('📋 Checking Environment Variables:')
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`)
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing'}`)
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set (will use default)'}\n`)

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Missing required environment variables!')
    console.log('Add these to your .env file:')
    console.log('EMAIL_USER=your-email@gmail.com')
    console.log('EMAIL_PASS=your-app-password')
    return
  }

  // Create transporter
  console.log('🔧 Creating Email Transporter...')
  const transporter = nodemailer.createTransport({
    service: 'gmail', // change if you use another provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  try {
    // Test connection
    console.log('🔍 Testing SMTP Connection...')
    await transporter.verify()
    console.log('✅ SMTP Connection Successful!\n')

    // Send test email
    console.log('📤 Sending Test Email...')
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🧪 Email Configuration Test - Success!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #28a745;">✅ Email Configuration Test Successful!</h2>
          <p>If you're reading this, your email configuration is working correctly.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>Email Service:</strong> Gmail</li>
              <li><strong>Sender:</strong> ${process.env.EMAIL_USER}</li>
              <li><strong>Test Time:</strong> ${new Date().toLocaleString()}</li>
            </ul>
          </div>
          <p>You're ready to implement email verification! 🎉</p>
          <hr style="margin: 20px 0;">
          <small>This is an automated test email from your application.</small>
        </div>
      `
    }

    const info = await transporter.sendMail(testEmail)
    console.log('✅ Test Email Sent Successfully!')
    console.log(`📧 Message ID: ${info.messageId}`)
    console.log(`📬 Check your inbox: ${process.env.EMAIL_USER}\n`)

    // Test verification email template
    console.log('🧪 Testing Verification Email Template...')
    const verificationEmail = createVerificationEmailTemplate('test-token-123', 'John Doe', process.env.EMAIL_USER)

    const verificationTest = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Please verify your email address - Test',
      html: verificationEmail
    }

    const verificationInfo = await transporter.sendMail(verificationTest)
    console.log('✅ Verification Email Template Test Sent!')
    console.log(`📧 Message ID: ${verificationInfo.messageId}`)

    console.log('\n🎉 All Email Tests Passed!')
    console.log('✅ Your email configuration is ready for production')

  } catch (error) {
    console.log('\n❌ Email Test Failed!')
    console.error('Error details:', error)
    // Helpful hints
    if (String(error).toLowerCase().includes('invalid login') || String(error).toLowerCase().includes('authentication')) {
      console.log('\n💡 Common Solutions:')
      console.log('1. Enable 2FA on your Gmail account (recommended).')
      console.log('2. Create an "App Password" and use it as EMAIL_PASS (Google Account → Security → App Passwords).')
    } else if (String(error).includes('ENOTFOUND')) {
      console.log('\n💡 Network Issue:')
      console.log('1. Check your internet connection')
      console.log('2. Verify your SMTP settings')
    }
  }
}

// Email template for verification
function createVerificationEmailTemplate(token, firstName, email) {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`

  return `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Welcome ${firstName}!</h1>
        <p style="color: #666; font-size: 16px;">Please verify your email address to complete your registration</p>
      </div>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <p style="margin-bottom: 20px;">Click the button below to verify your email address:</p>
        <a href="${verificationUrl}"
           style="display: inline-block; padding: 15px 30px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Verify Email Address
        </a>
      </div>
      <div style="margin: 20px 0;">
        <p style="color: #666;">Or copy and paste this link in your browser:</p>
        <p style="background: #f1f1f1; padding: 10px; border-radius: 4px; word-break: break-all; font-family: monospace;">
          ${verificationUrl}
        </p>
      </div>
      <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
        <p style="color: #666; font-size: 14px;">
          This verification link will expire in 24 hours for security reasons.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #999; font-size: 12px;">
          This is an automated message, please do not reply to this email.
        </p>
      </div>
    </div>
  `
}

// Run the test immediately when executing this file directly
testEmailConfiguration()
  .then(() => {
    console.log('\n🏁 Test Complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })

// Keep exports so you can import these in other modules if needed
export { testEmailConfiguration, createVerificationEmailTemplate }
