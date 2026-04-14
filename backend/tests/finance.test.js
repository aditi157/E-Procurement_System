import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"
import jwt from "jsonwebtoken"

describe("Finance Invoice Processing", () => {
  let financeUser
  let token
  let invoice

  beforeAll(async () => {
    financeUser = await prisma.user.create({
      data: {
        name: "Finance Test",
        email: `finance-${Date.now()}@test.com`,
        password: "pass",
        role: "FINANCE",
        orgName: "Test Org"
      }
    })

    token = jwt.sign(
      {
        id: financeUser.id,
        role: financeUser.role
      },
      "SECRET_KEY"
    )

    invoice = await prisma.invoice.findFirst()

    if (!invoice) {
      throw new Error("No invoice found for finance test")
    }
  })

  test("Reject invoice", async () => {
    const res = await request(app)
      .post(`/api/finance/invoice/${invoice.id}/reject`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)

    const updated = await prisma.invoice.findUnique({
      where: { id: invoice.id }
    })

    expect(updated.status).toBe("REJECTED")
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: { id: financeUser.id }
    })

    await prisma.$disconnect()
  })
})