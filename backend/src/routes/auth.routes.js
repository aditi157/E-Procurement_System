import express from "express"
import { register, login } from "../controllers/auth.controller.js"
import { getMe } from "../controllers/auth.controller.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/me", verifyToken, getMe)
router.post("/register", register)
router.post("/login", login)

export default router