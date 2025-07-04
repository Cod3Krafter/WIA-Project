import express from "express"
import { authenticateToken } from "../middleware/authenticateToken.js"
import { createProject, deleteProject, getProjectById, getProjectsBySkill, updateProject } from "../controller/projectController.js"

const router = express.Router()

// Freelancers can add their projects
router.post("/", authenticateToken, createProject)
router.get("/:id", authenticateToken, getProjectById)
router.get("/skill/:skill_id", authenticateToken, getProjectsBySkill)
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);


export default router