import express from "express"
import { applyToJob, getApplicationsForJob, getMyJobApplications, deleteJobApplication } from "../controller/jobApplicationController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = express.Router()

// View all the applications for each job
router.get("/job/:job_id", authenticateToken, getApplicationsForJob);

// Freelancers apply for jobs
router.post("/",authenticateToken, applyToJob)


// Freelancer can view jobs they've applied to
router.get('/user', authenticateToken, getMyJobApplications);

// Freelancer can delete their job applications
router.delete('/user/:jobId', authenticateToken, deleteJobApplication);

export default router