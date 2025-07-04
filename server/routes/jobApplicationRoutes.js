import express from "express"
import { applyToJob, getApplicationsForJob, getMyJobApplications } from "../controller/jobApplicationController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = express.Router()

// Freelancers apply for jobs
router.post("/",authenticateToken, applyToJob)

// View all the applications for each job
router.get("/job/:job_id", authenticateToken, getApplicationsForJob);

// Freelancer can view jobs they've applied to
router.get('/user', authenticateToken, getMyJobApplications);

export default router