import express from "express"
import { createSkill, getAllSkills, deleteSkill, updateSkill, getUserSkills } from "../controller/skillController.js"
import { authenticateToken } from "../middleware/authenticateToken.js"

const router = express.Router()

router.post("/", authenticateToken, createSkill)
router.get("/", getAllSkills)
router.get('/user', authenticateToken, getUserSkills);
router.put('/:id', authenticateToken, updateSkill);
router.delete('/:id', authenticateToken, deleteSkill);

export default router