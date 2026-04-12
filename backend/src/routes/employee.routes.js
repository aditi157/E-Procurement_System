import express from "express"
import {
  createRequest,
  getMyRequests
} from "../controllers/employee.controller.js"

const router = express.Router()

router.post("/request", createRequest)
router.get("/request/:employeeId", getMyRequests)

export default router