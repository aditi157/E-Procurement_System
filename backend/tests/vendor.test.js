import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

describe("Vendor Order Workflow", () => {
  let vendor
  let manager
  let order

  beforeAll(async () => {
    vendor = await prisma.user.create({
      data: {
        name: "Vendor Test",
        email: "vendor@test.com",
        password: "pass",
        role: "VENDOR",
        orgName: "Test Org"
      }
    })

    manager = await prisma.user.create({
      data: {
        name: "Manager Test",
        email: "manager-vendor@test.com",
        password: "pass",
        role: "MANAGER",
        orgName: "Test Org"
      }
    })

    order = await prisma.order.create({
      data: {
        name: "Vendor Test Order",
        managerId: manager.id,
        vendorId: vendor.id,
        status: "SUBMITTED"
      }
    })
  })

  test("Vendor accepts order", async () => {
    const res = await request(app)
      .post(`/api/vendor/orders/${order.id}/accept`)

    expect(res.statusCode).toBe(200)

    const updated = await prisma.order.findUnique({
      where: { id: order.id }
    })

    expect(updated.status).toBe("ACCEPTED")
  })

  test("Vendor rejects order", async () => {
    const newOrder = await prisma.order.create({
      data: {
        name: "Reject Test",
        managerId: manager.id,
        vendorId: vendor.id,
        status: "SUBMITTED"
      }
    })

    const res = await request(app)
      .post(`/api/vendor/orders/${newOrder.id}/reject`)

    expect(res.statusCode).toBe(200)

    const updated = await prisma.order.findUnique({
      where: { id: newOrder.id }
    })

    expect(updated.status).toBe("REJECTED")
  })
})