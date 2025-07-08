import express from "express"
import { registerUser, loginUser, getUser, logoutUser } from "../controller/authController.js"
import {authenticateToken} from "../middleware/authenticateToken.js"

const router = express.Router()

router.post("/register", registerUser)
router.get("/profile", authenticateToken, getUser)
router.post("/login", loginUser)
router.post("/logout", authenticateToken, logoutUser)

export default router