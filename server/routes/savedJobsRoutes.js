import express from "express"
import { authenticateToken } from "../middleware/authenticateToken.js";
import { toggleSaveJob, getSavedJobs, deleteSavedJob } from "../controller/savedJobsController.js";

const router = express.Router()

router.get('/', authenticateToken, getSavedJobs);
router.post('/', authenticateToken, toggleSaveJob);
router.delete('/delete/:job_id', authenticateToken, deleteSavedJob);


export default router