import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

describe("Cancel Order", () => {
  test("Should cancel order", async () => {
    const manager = await prisma.user.create({
      data: {
        name: "Cancel Manager",
        email: "cancel@test.com",
        password: "pass",
        role: "MANAGER",
        orgName: "Test Org"
      }
    })

    const order = await prisma.order.create({
      data: {
        name: "Cancelable",
        managerId: manager.id,
        status: "DRAFT"
      }
    })

    const res = await request(app)
      .post(`/api/orders/${order.id}/cancel`)

    expect(res.statusCode).toBe(200)

    const updated = await prisma.order.findUnique({
      where: { id: order.id }
    })

    expect(updated.status).toBe("CANCELLED")
  })
})