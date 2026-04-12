import prisma from "../config/db.js"

// Create request
// export const createRequest = async (req, res) => {
//   try {
//     const { title, description, amount, employeeId } = req.body

//     const request = await prisma.request.create({
//       data: {
//         title,
//         description,
//         amount: Number(amount),
//         employeeId
//       }
//     })

//     res.status(201).json(request)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Failed to create request" })
//   }
// }


export const createRequest = async (req, res) => {
  try {
    const { title, description, employeeId, items } = req.body

    // calculate total
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )

    const request = await prisma.request.create({
      data: {
        title,
        description,
        totalAmount,
        employeeId,
        items: {
          create: items
        }
      },
      include: {
        items: true
      }
    })

    res.status(201).json(request)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create request" })
  }
}

// Get all requests of employee
// export const getMyRequests = async (req, res) => {
//   try {
//     const { employeeId } = req.params

//     const requests = await prisma.request.findMany({
//       where: { employeeId },
//       orderBy: { createdAt: "desc" }
//     })

//     res.json(requests)
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ error: "Failed to fetch requests" })
//   }
// }

export const getMyRequests = async (req, res) => {
  try {
    const { employeeId } = req.params

    const requests = await prisma.request.findMany({
      where: { employeeId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    })

    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch requests" })
  }
}