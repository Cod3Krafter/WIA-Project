import express from "express"
import { authenticateToken } from "../middleware/authenticateToken.js";
import { toggleSaveJob, getSavedJobs } from "../controller/savedJobsController.js";

const router = express.Router()

router.get('/', authenticateToken, getSavedJobs);
router.post('/', authenticateToken, toggleSaveJob);


export default router