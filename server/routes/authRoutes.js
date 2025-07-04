import express from "express"
import { registerUser, loginUser, getUser } from "../controller/authController.js"
import {authenticateToken} from "../middleware/authenticateToken.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", authenticateToken, getUser)

export default router