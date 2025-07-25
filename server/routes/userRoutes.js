import express from "express"
import {authenticateToken} from "../middleware/authenticateToken.js"
import { getAllUsers, getUserById, updateUser } from "../controller/userController.js"

const router = express.Router()


router.get("/freelancers", authenticateToken, getAllUsers)
router.get("/:id",authenticateToken, getUserById)
router.put("/:id", authenticateToken, updateUser)

export default router