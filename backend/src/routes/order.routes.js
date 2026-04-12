import express from "express"
import {
  createOrder,
  getOrders,
  submitOrder,
  addToOrder,
  createManualOrder,
  cancelOrder
} from "../controllers/order.controller.js"

const router = express.Router()

router.post("/", createOrder)
router.get("/", getOrders)
router.post("/:orderId/add", addToOrder)
router.post("/manual", createManualOrder)

router.post("/:orderId/cancel", cancelOrder)
router.post("/:orderId/submit", submitOrder)

export default router