import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import skillRoutes from "./routes/skillRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import savedJobsRoutes from "./routes/savedJobsRoutes.js"


dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/skill", skillRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/job-applications", jobApplicationRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/saved-jobs", savedJobsRoutes)



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
})

