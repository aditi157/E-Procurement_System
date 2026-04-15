import express from "express"
import {
  createAuction,
  getAuctions,
  inviteVendor,
  getVendors,
  updateAuction,
  submitBid,
  selectBid,
  getAuctionBids,
  addToAuction          // FIX: was never imported or registered
} from "../controllers/auction.controller.js"

const router = express.Router()

router.get("/vendors/list", getVendors)

router.get("/", getAuctions)
router.post("/", createAuction)

/* INVITE */
router.post("/:auctionId/invite", inviteVendor)

/* ADD REQUEST TO EXISTING AUCTION — FIX: route was missing */
router.post("/:auctionId/add", addToAuction)

router.put("/:auctionId", updateAuction)

router.post("/:auctionId/bid", submitBid)
router.post("/:auctionId/select-bid/:bidId", selectBid)
router.get("/:auctionId/bids", getAuctionBids)

export default router