import prisma from "../config/db.js"

/* GET ALL INVOICES */
export const getPendingInvoices = async (req, res) => {
  try {
    const financeId = req.user.id

    const financeUser = await prisma.user.findUnique({
      where: { id: financeId }
    })

    const invoices = await prisma.invoice.findMany({
      where: {
        vendorOrder: {
          order: {
            manager: {
              organizationName: financeUser.organizationName
            }
          }
        }
      },
      include: {
        vendorOrder: {
          include: {
            vendor: true,
            order: {
              include: {
                items: true,
                manager: true
              }
            }
          }
        },
        payment: true
      },
      orderBy: {
        issuedAt: "desc"
      }
    })

    res.json(invoices)

  } catch (err) {
    console.error("GET FINANCE INVOICES ERROR:", err)
    res.status(500).json({
      error: "Failed to fetch invoices"
    })
  }
}

/* APPROVE + PAY */
export const approveInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params
    const { financeId } = req.body

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    })

    if (!invoice) {
      return res.status(404).json({
        error: "Invoice not found"
      })
    }

    await prisma.payment.create({
      data: {
        amount: invoice.totalAmount,
        status: "COMPLETED",
        paidAt: new Date(),
        invoiceId,
        financeId
      }
    })

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID"
      }
    })

    res.json(updated)

  } catch (err) {
    console.error("APPROVE INVOICE ERROR:", err)
    res.status(500).json({
      error: "Failed to approve invoice"
    })
  }
}

/* REJECT */
export const rejectInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params

    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "REJECTED"
      }
    })

    res.json(invoice)

  } catch (err) {
    console.error("REJECT INVOICE ERROR:", err)
    res.status(500).json({
      error: "Failed to reject invoice"
    })
  }
}