import express from "express"
import { registerUser, loginUser, getUser, logoutUser, verifyEmail, resendVerification } from "../controller/authController.js"
import {authenticateToken} from "../middleware/authenticateToken.js"

const router = express.Router()

router.post("/register", registerUser)
router.get("/profile", authenticateToken, getUser)
router.post("/login", loginUser)
router.post("/logout", authenticateToken, logoutUser)

router.get("/verify-email", verifyEmail)
router.post("/resend-verification", resendVerification)

export default router