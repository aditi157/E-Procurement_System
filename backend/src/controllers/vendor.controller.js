import prisma from "../config/db.js"

/* ---------- GET ORDERS ---------- */
export const getVendorOrders = async (req, res) => {
  const { vendorId } = req.params

  const orders = await prisma.order.findMany({
    where: { vendorId },
    include: { items: true, manager: true },
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

/* ---------- DELIVER ----------
   FIX: vendorOrder may not exist for directly-submitted orders.
   Always update the Order status. Only update vendorOrder if it exists.
*/
export const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    // Always mark the order itself as delivered
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date()
      }
    })

    // Update vendorOrder only if one exists (auction-sourced orders have one, direct orders may not)
    const vendorOrder = await prisma.vendorOrder.findFirst({
      where: { orderId }
    })

    if (vendorOrder) {
      await prisma.vendorOrder.update({
        where: { id: vendorOrder.id },
        data: { status: "DELIVERED" }
      })
    }

    res.json({ message: "Order marked delivered" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to mark delivered" })
  }
}

/* ---------- AUCTIONS ---------- */
export const getVendorAuctions = async (req, res) => {
  try {
    const { vendorId } = req.params

    const invites = await prisma.auctionInvite.findMany({
      where: { vendorId },
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
    res.status(500).json({ error: "Failed to fetch vendor auctions" })
  }
}

export const getVendorBids = async (req, res) => {
  try {
    const { vendorId } = req.params

    const bids = await prisma.bid.findMany({
      where: { vendorId },
      include: { auction: true },
      orderBy: { createdAt: "desc" }
    })

    res.json(bids)

  } catch (err) {
    console.error("GET VENDOR BIDS ERROR:", err)
    res.status(500).json({ error: "Failed to fetch vendor bids" })
  }
}

// export const submitInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params
//     const { invoiceNumber, dueDate, notes } = req.body

//     const vendorOrder = await prisma.vendorOrder.findFirst({
//       where: { orderId },
//       include: {
//         order: { include: { items: true } }
//       }
//     })

//     const total = vendorOrder.order.items.reduce(
//       (sum, i) => sum + i.quantity * i.unitPrice,
//       0
//     )

//     const existing = await prisma.invoice.findFirst({
//       where: { vendorOrderId: vendorOrder.id }
//     })

//     if (existing) {
//       return res.status(400).json({ error: "Invoice already exists for this order" })
//     }

//     const invoice = await prisma.invoice.create({
//       data: {
//         invoiceNumber,
//         totalAmount: total,
//         dueDate: dueDate ? new Date(dueDate) : null,
//         notes,
//         vendorOrderId: vendorOrder.id,
//         status: "SUBMITTED"
//       }
//     })

//     res.json(invoice)

//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Failed to submit invoice" })
//   }
// }


export const submitInvoice = async (req, res) => {
  try {
    const { orderId } = req.params
    const { invoiceNumber, dueDate, notes } = req.body
    const vendorId = req.user.id

    let vendorOrder = await prisma.vendorOrder.findFirst({
      where: { orderId },
      include: {
        order: { include: { items: true } }
      }
    })

    // Create vendorOrder if missing
    if (!vendorOrder) {
      vendorOrder = await prisma.vendorOrder.create({
        data: {
          orderId,
          vendorId,
          status: "DELIVERED"
        },
        include: {
          order: { include: { items: true } }
        }
      })
    }

    const existing = await prisma.invoice.findFirst({
      where: { vendorOrderId: vendorOrder.id }
    })

    if (existing) {
      return res.status(400).json({
        error: "Invoice already exists for this order"
      })
    }

    const total = vendorOrder.order.items.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0
    )

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
    console.log("ORDER ITEMS:", vendorOrder.order.items)

    res.json(invoice)

  } catch (err) {
    console.error("SUBMIT INVOICE ERROR:", err)
    res.status(500).json({
      error: "Failed to submit invoice"
    })
  }
}

/* ---------- INVOICE ELIGIBLE ORDERS
   FIX: Direct orders never get a VendorOrder row, so we can't query
   vendorOrder with status=DELIVERED. Instead, query Order directly:
   - status = DELIVERED
   - vendorId = current user
   - no invoice yet (check via vendorOrder OR directly)
*/
export const getInvoiceEligibleOrders = async (req, res) => {
  try {
    const vendorId = req.user.id

    // Find all delivered orders assigned to this vendor
    const deliveredOrders = await prisma.order.findMany({
      where: {
        vendorId,
        status: "DELIVERED"
      },
      include: { items: true }
    })

    // For each order, check if an invoice already exists
    // An invoice links via vendorOrder, so we need to check that chain
    const eligible = []

    for (const order of deliveredOrders) {
      const vendorOrder = await prisma.vendorOrder.findFirst({
        where: { orderId: order.id },
        include: { invoice: true }
      })

      // No vendorOrder at all → create one on the fly, then eligible
      // VendorOrder exists but no invoice → eligible
      // VendorOrder exists and has invoice → skip
      if (!vendorOrder) {
        // Create a VendorOrder record so invoicing can work
        await prisma.vendorOrder.create({
          data: {
            orderId: order.id,
            vendorId,
            status: "DELIVERED"
          }
        })
        eligible.push({ id: order.id, name: order.name, items: order.items })
      } else if (!vendorOrder.invoice) {
        eligible.push({ id: order.id, name: order.name, items: order.items })
      }
      // else: invoice exists, skip
    }

    res.json(eligible)

  } catch (err) {
    console.error("GET ELIGIBLE ORDERS ERROR:", err)
    res.status(500).json({ error: "Failed to fetch eligible orders" })
  }
}


export const getVendorInvoices = async (req, res) => {
  try {
    const vendorId = req.user.id

    const invoices = await prisma.invoice.findMany({
      where: {
        vendorOrder: { vendorId }
      },
      include: {
        vendorOrder: {
          include: { order: true }
        },
        payment: true
      },
      orderBy: { issuedAt: "desc" }
    })

    const formatted = invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      totalAmount: inv.totalAmount,
      dueDate: inv.dueDate,
      issuedAt: inv.issuedAt,
      notes: inv.notes,
      status:
        inv.payment?.status === "COMPLETED" ? "PAID" : "SUBMITTED",
      order: inv.vendorOrder.order
    }))

    res.json(formatted)

  } catch (err) {
    console.error("GET VENDOR INVOICES ERROR:", err)
    res.status(500).json({ error: "Failed to fetch vendor invoices" })
  }
}