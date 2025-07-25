import express from "express"
import { createJob, deleteJob, getAllJobs, getMyPostedJobs } from "../controller/jobController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = express.Router()

router.get("/jobposts", getAllJobs)
router.get("/user",authenticateToken, getMyPostedJobs)
router.post("/job", authenticateToken, createJob)
router.delete("/:id", authenticateToken, deleteJob)

export default router