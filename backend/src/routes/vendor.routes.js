import express from "express"
import {
  getVendorOrders,
  acceptOrder,
  rejectOrder,
  deliverOrder,
  getVendorAuctions,
  getVendorBids, 
  submitInvoice,
  getInvoiceEligibleOrders,
  getVendorInvoices
} from "../controllers/vendor.controller.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.get("/orders/:vendorId", getVendorOrders)
router.post("/orders/:orderId/accept", acceptOrder)
router.post("/orders/:orderId/reject", rejectOrder)
router.post("/orders/:orderId/deliver", deliverOrder)

router.get("/auctions/:vendorId", getVendorAuctions)
router.get("/bids/:vendorId", getVendorBids)
router.post("/orders/:orderId/invoice",verifyToken, submitInvoice)
router.get(
  "/invoice-eligible-orders",
  verifyToken,
  getInvoiceEligibleOrders
)
router.get(
  "/invoices",
  verifyToken,
  getVendorInvoices
)
export default router