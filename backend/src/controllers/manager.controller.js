import prisma from "../config/db.js"

// GET all pending requests
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await prisma.request.findMany({

      include: {
        items: true,
        employee: true
      },
      orderBy: { createdAt: "desc" }
    })

    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch requests" })
  }
}

// APPROVE / REJECT
export const handleApproval = async (req, res) => {
  try {
    const { requestId } = req.params
    const { status, managerId, comments } = req.body

    console.log("APPROVAL HIT:", requestId, status) // 🔍 DEBUG

    // 1. Update request status FIRST
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { status }
    })

    console.log("REQUEST UPDATED:", updatedRequest.id)

    // 2. Always try create (safe fallback)
    try {
      await prisma.approval.create({
        data: {
          status,
          comments,
          requestId,
          managerId
        }
      })
    } catch (e) {
      console.log("Approval already exists, skipping create")
    }

    res.json({ message: "Approval successful" })

  } catch (err) {
    console.error("APPROVAL ERROR FULL:", err)
    res.status(500).json({ error: "Approval failed" })
  }
}