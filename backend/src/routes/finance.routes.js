import { verifyToken } from "../middleware/auth.js"
import {getPendingInvoices, approveInvoice, rejectInvoice} from "../controllers/finance.controller.js"
import express from "express"
import e from "express"

const router = express.Router()
router.get(
  "/invoices",
  verifyToken,
  getPendingInvoices
)

router.post(
  "/invoice/:invoiceId/approve",
  verifyToken,
  approveInvoice
)

router.post(
  "/invoice/:invoiceId/reject",
  verifyToken,
  rejectInvoice
)

export default router