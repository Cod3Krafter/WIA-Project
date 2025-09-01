import express from "express"
import { authenticateToken } from "../middleware/authenticateToken.js"
import { getContactMethods, getUserContactMethods, setContactMethod } from "../controller/contactController.js"

const router = express.Router()

router.get("/:id", authenticateToken, getContactMethods)
router.get("/", authenticateToken, getUserContactMethods)
router.put("/update", authenticateToken, setContactMethod);


export default router