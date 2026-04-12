import prisma from "../config/db.js"




/* CREATE AUCTION */
export const createAuction = async (req, res) => {
  try {
    const {
      name,
      description,
      managerId,
      items,
      requestId,
      startDate,
      endDate,
      deliveryDate
    } = req.body

    const auction = await prisma.auction.create({
      data: {
        name,
        description,
        status: "ONGOING",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        deliveryDate: new Date(deliveryDate),

        managerId,
        requestId,

        items: {
          create: items.map(i => ({
            name: i.name,
            quantity: i.quantity
          }))
        }
      }
    })

    res.json(auction)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create auction" })
  }
}

/* GET AUCTIONS */
export const getAuctions = async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      include: {
        items: true,
        invites: true
      }
    })

    res.json(auctions)
  } catch (err) {
    res.status(500).json({ error: "Failed" })
  }
}

/* INVITE VENDOR */
export const inviteVendor = async (req, res) => {
  try {
    const { auctionId } = req.params
    const { vendorId } = req.body

    await prisma.auctionInvite.create({
      data: {
        auctionId,
        vendorId
      }
    })

    res.json({ message: "Vendor invited" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to invite" })
  }
}

/* GET VENDORS */
export const getVendors = async (req, res) => {
  try {
    const vendors = await prisma.user.findMany({
      where: { role: "VENDOR" }
    })

    res.json(vendors)

  } catch (err) {
    res.status(500).json({ error: "Failed" })
  }
}




export const addToAuction = async (req, res) => {
  try {
    const { auctionId } = req.params
    const { requestId } = req.body

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { items: true }
    })

    await prisma.auctionItem.createMany({
      data: request.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        auctionId
      }))
    })

    res.json({ message: "Added to auction" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed" })
  }
}




export const updateAuction = async (req, res) => {
  try {
    const { auctionId } = req.params
    const {
      name,
      description,
      startDate,
      endDate,
      deliveryDate
    } = req.body

    const updated = await prisma.auction.update({
      where: { id: auctionId },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        deliveryDate: new Date(deliveryDate)
      }
    })

    res.json(updated)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Update failed" })
  }
}

export const submitBid = async (req, res) => {
  try {
    const { auctionId } = req.params
    const { vendorId, amount, deliveryDate, notes } = req.body
const existing = await prisma.bid.findFirst({
  where: {
    auctionId,
    vendorId
  }
})

if (existing) {
  return res.status(400).json({
    error: "You already submitted a bid"
  })
}
    const bid = await prisma.bid.create({
      data: {
        auctionId,
        vendorId,
        amount: parseFloat(amount),
        deliveryDate: new Date(deliveryDate),
        notes
      }
    })

    res.json(bid)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to submit bid" })
  }
}


export const getAuctionBids = async (req, res) => {
  try {
    const { auctionId } = req.params

    const bids = await prisma.bid.findMany({
      where: {
        auctionId
      },
      include: {
        vendor: true
      },
      orderBy: {
        amount: "asc"
      }
    })

    res.json(bids)

  } catch (err) {
    console.error("GET BIDS ERROR:", err)
    res.status(500).json({
      error: "Failed to fetch bids"
    })
  }
}


export const selectBid = async (req, res) => {
  try {
    const { auctionId, bidId } = req.params

    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        auction: {
          include: { items: true }
        }
      }
    })

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" })
    }

    /* CREATE ORDER */
    const order = await prisma.order.create({
      data: {
        name: `Auction Order - ${Date.now()}`,
        status: "ACCEPTED",
        managerId: bid.auction.managerId,
        vendorId: bid.vendorId,

        items: {
          create: bid.auction.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: bid.amount / bid.auction.items.length
          }))
        }
      }
    })

    /* UPDATE BIDS */
    await prisma.bid.updateMany({
      where: { auctionId },
      data: { status: "REJECTED" }
    })

    await prisma.bid.update({
      where: { id: bidId },
      data: { status: "SELECTED" }
    })

    /* COMPLETE AUCTION */
    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: "COMPLETED"
      }
    })

    res.json(order)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to select bid" })
  }
}