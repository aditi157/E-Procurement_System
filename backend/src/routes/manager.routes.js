import express from "express"
import {
  getPendingRequests,
  handleApproval
} from "../controllers/manager.controller.js"

const router = express.Router()

router.get("/requests", getPendingRequests)
router.post("/request/:requestId", handleApproval)

export default router