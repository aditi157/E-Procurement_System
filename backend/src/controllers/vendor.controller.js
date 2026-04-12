import prisma from "../config/db.js"

/* ---------- GET ORDERS ---------- */
export const getVendorOrders = async (req, res) => {
  const { vendorId } = req.params

  const orders = await prisma.order.findMany({
    where: { vendorId },
    include: { items: true }
  })

  res.json(orders)
}

/* ---------- ACCEPT ---------- */
export const acceptOrder = async (req, res) => {
  const { orderId } = req.params

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "ACCEPTED" }
  })

  res.json({ message: "Accepted" })
}

/* ---------- REJECT ---------- */
export const rejectOrder = async (req, res) => {
  const { orderId } = req.params

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "REJECTED" }
  })

  res.json({ message: "Rejected" })
}

/* ---------- DELIVER ---------- */
// export const deliverOrder = async (req, res) => {
//   const { orderId } = req.params

//   await prisma.order.update({
//     where: { id: orderId },
//     data: { status: "DELIVERED" }
//   })

//   res.json({ message: "Delivered" })
// }

export const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date()
      }
    })

    await prisma.vendorOrder.update({
      where: {
        orderId
      },
      data: {
        status: "DELIVERED"
      }
    })

    res.json({
      message: "Order marked delivered"
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to mark delivered"
    })
  }
}
/* ---------- AUCTIONS ---------- */
// export const getVendorAuctions = async (req, res) => {
//   const { vendorId } = req.params

//   const invites = await prisma.auctionInvite.findMany({
//     where: { vendorId },
//     include: {
//       auction: {
//         include: { items: true, manager: true, invites: true }
//       }
//     }
//   })

//   const auctions = invites.map(i => i.auction)

//   res.json(auctions)
// }



export const getVendorAuctions = async (req, res) => {
  try {
    const { vendorId } = req.params

    const invites = await prisma.auctionInvite.findMany({
      where: {
        vendorId
      },
      include: {
        auction: {
          include: {
            items: true,
            manager: true
          }
        }
      }
    })

    const auctions = invites.map(i => i.auction)

    res.json(auctions)

  } catch (err) {
    console.error("GET VENDOR AUCTIONS ERROR:", err)
    res.status(500).json({
      error: "Failed to fetch vendor auctions"
    })
  }
}

export const getVendorBids = async (req, res) => {
  try {
    const { vendorId } = req.params

    const bids = await prisma.bid.findMany({
      where: { vendorId },
      include: {
        auction: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.json(bids)

  } catch (err) {
    console.error("GET VENDOR BIDS ERROR:", err)
    res.status(500).json({
      error: "Failed to fetch vendor bids"
    })
  }
}


export const submitInvoice = async (req, res) => {
  try {
    const { orderId } = req.params
    const { invoiceNumber, dueDate, notes } = req.body

    const vendorOrder = await prisma.vendorOrder.findFirst({
      where: {
        orderId
      },
      include: {
        order: {
          include: {
            items: true
          }
        }
      }
    })

    const total = vendorOrder.order.items.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0
    )

    const existing = await prisma.invoice.findFirst({
  where: {
    vendorOrderId: vendorOrder.id
  }
})

if (existing) {
  return res.status(400).json({
    error: "Invoice already exists for this order"
  })
}

    const invoice = await prisma.invoice.create({
  data: {
    invoiceNumber,
    totalAmount: total,
    dueDate: dueDate ? new Date(dueDate) : null,
    notes,
    vendorOrderId: vendorOrder.id,
    status: "SUBMITTED"
  }
})

    res.json(invoice)

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to submit invoice"
    })
  }
}

// export const getInvoiceEligibleOrders = async (req, res) => {
//   try {
//     const vendorId = req.user.id

//     const orders = await prisma.vendorOrder.findMany({
//       where: {
//         vendorId,
//         status: "DELIVERED",
//         invoice: null
//       },
//       include: {
//         items: true
//       }
//     })

//     res.json(orders)

//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Failed to fetch eligible orders" })
//   }
// }
export const getInvoiceEligibleOrders = async (req, res) => {
  try {
    const vendorId = req.user.id

    const vendorOrders = await prisma.vendorOrder.findMany({
      where: {
        vendorId,
        status: "DELIVERED",
        invoice: null
      },
      include: {
        order: {
          include: {
            items: true
          }
        }
      }
    })

    const formatted = vendorOrders.map(vo => ({
      id: vo.order.id,
      name: vo.order.name,
      items: vo.order.items
    }))

    res.json(formatted)

  } catch (err) {
    console.error("GET ELIGIBLE ORDERS ERROR:", err)
    res.status(500).json({
      error: "Failed to fetch eligible orders"
    })
  }
}


export const getVendorInvoices = async (req, res) => {
  try {
    const vendorId = req.user.id

    const invoices = await prisma.invoice.findMany({
      where: {
        vendorOrder: {
          vendorId
        }
      },
      include: {
        vendorOrder: {
          include: {
            order: true
          }
        },
        payment: true
      },
      orderBy: {
        issuedAt: "desc"
      }
    })

    const formatted = invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      totalAmount: inv.totalAmount,
      dueDate: inv.dueDate,
      issuedAt: inv.issuedAt,
      notes: inv.notes,

      status:
        inv.payment?.status === "COMPLETED"
          ? "PAID"
          : "SUBMITTED",

      order: inv.vendorOrder.order
    }))

    res.json(formatted)

  } catch (err) {
    console.error("GET VENDOR INVOICES ERROR:", err)
    res.status(500).json({
      error: "Failed to fetch vendor invoices"
    })
  }
}