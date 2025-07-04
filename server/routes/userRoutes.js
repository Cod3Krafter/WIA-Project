import express from "express"
import {authenticateToken} from "../middleware/authenticateToken.js"
import { getUserById, updateUser } from "../controller/userController.js"

const router = express.Router()

router.get("/:id", getUserById)
router.put("/:id", authenticateToken, updateUser)

export default router