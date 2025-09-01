import express from "express";
import { hireFreelancer, rejectFreelancer, getJobStatus } from "../controller/applicationStatusController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// PATCH /applications/:applicationId/hire
router.get("/:jobId/status", authenticateToken, getJobStatus);
router.patch("/:applicationId/hire", authenticateToken, hireFreelancer);
router.patch("/:applicationId/reject", authenticateToken, rejectFreelancer);

export default router;