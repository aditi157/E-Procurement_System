import express from "express"
import {
  createAuction,
  getAuctions,
  inviteVendor,
  getVendors,
  updateAuction,
  submitBid,
  selectBid,
  getAuctionBids
} from "../controllers/auction.controller.js"

const router = express.Router()

router.get("/vendors/list", getVendors)

router.get("/", getAuctions)
router.post("/", createAuction)

/* INVITE */
router.post("/:auctionId/invite", inviteVendor)

/* SEARCH VENDORS */

router.put("/:auctionId", updateAuction)

router.post("/:auctionId/bid", submitBid)
router.post("/:auctionId/select-bid/:bidId", selectBid)
router.get("/:auctionId/bids", getAuctionBids)


export default router