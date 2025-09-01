import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { generalRateLimiter } from './middleware/rateLimiter.js'
import { connectDB } from './config/db.js'

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import jobApplicationRoutes from './routes/jobApplicationRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import savedJobsRoutes from './routes/savedJobsRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import applicationStatusRoutes from './routes/applicationStatusRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// For ESModules __dirname workaround
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(generalRateLimiter)
app.use(express.json())

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/skill', skillRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/job-applications', jobApplicationRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/saved-jobs', savedJobsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/application-status', applicationStatusRoutes)

// 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, '../client/dist')))

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

// Start server after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})