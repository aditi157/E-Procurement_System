import prisma from "../config/db.js"

// CREATE ORDER FROM REQUEST
export const createOrder = async (req, res) => {
  try {
    const { requestId, managerId } = req.body

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { items: true }
    })

    if (!request) {
      return res.status(404).json({ error: "Request not found" })
    }

    // create order
    const order = await prisma.order.create({
  data: {
    name: `Order-${Date.now()}`, // ✅ auto name
    managerId,
    status: "DRAFT",
    items: {
      create: request.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    }
  }
})

    // attach request → order
    await prisma.request.update({
      where: { id: requestId },
      data: { orderId: order.id }
    })

    res.status(201).json(order)

  } catch (err) {
    console.error("ORDER CREATE ERROR:", err)
    res.status(500).json({ error: "Failed to create order" })
  }
}


// GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        requests: true,
        vendor: true
      },
      orderBy: { createdAt: "desc" }
    })
    console.log(JSON.stringify(orders, null, 2))
    console.log("ORDERS FROM DB:", orders)

    res.json(orders)
  } catch (err) {
    console.error("GET ORDERS ERROR:", err)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
}





// ADD REQUEST TO EXISTING ORDER
export const addToOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const { requestId } = req.body

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { items: true }
    })

    if (!request) {
      return res.status(404).json({ error: "Request not found" })
    }

    // add items
    await prisma.orderItem.createMany({
      data: request.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        orderId
      }))
    })

    // link request → order (IMPORTANT FIX)
    await prisma.request.update({
      where: { id: requestId },
      data: { orderId }
    })

    res.json({ message: "Added to order" })

  } catch (err) {
    console.error("ADD TO ORDER ERROR:", err)
    res.status(500).json({ error: "Failed" })
  }
}


// CREATE MANUAL ORDER
export const createManualOrder = async (req, res) => {
  try {
    const { managerId, items } = req.body

    console.log("MANUAL ORDER HIT", req.body)

    const order = await prisma.order.create({
  data: {
    name: `Manual-${Date.now()}`, // ✅
    managerId,
    status: "DRAFT",
    items: {
      create: items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    }
  }
})

    res.json(order)

  } catch (err) {
    console.error("MANUAL ORDER ERROR:", err)
    res.status(500).json({ error: "Failed" })
  }
}

export const submitOrder = async (req, res) => {
  const { orderId } = req.params
  const { vendorId } = req.body

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "SUBMITTED",
      vendorId: vendorId
    }
  })

  res.json(order)
}


export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId" })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED"
      }
    })
    console.log("PARAMS:", req.params)

    res.json(updated)

  } catch (err) {
    console.error("CANCEL ERROR:", err)
    res.status(500).json({ error: "Failed to cancel order" })
  }
}