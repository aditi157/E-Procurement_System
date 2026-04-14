import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

describe("Order Creation Workflow", () => {
  let manager
  let employee
  let testRequest
  let createdOrder

  beforeAll(async () => {
    employee = await prisma.user.create({
      data: {
        name: "Order Employee",
        email: `orderemp-${Date.now()}@test.com`,
        password: "test123",
        role: "EMPLOYEE",
        orgName: "Test Org"
      }
    })

    manager = await prisma.user.create({
      data: {
        name: "Order Manager",
        email: `ordermgr-${Date.now()}@test.com`,
        password: "test123",
        role: "MANAGER",
        orgName: "Test Org"
      }
    })

    testRequest = await prisma.request.create({
      data: {
        title: "Hardware Request",
        description: "Need laptops",
        employeeId: employee.id,
        status: "APPROVED",
        totalAmount: 140000,
        items: {
          create: [
            {
              name: "Laptop",
              quantity: 2,
              unitPrice: 70000
            }
          ]
        }
      },
      include: { items: true }
    })
  })

  afterAll(async () => {
    if (createdOrder) {
      await prisma.orderItem.deleteMany({
        where: { orderId: createdOrder.id }
      })

      await prisma.order.delete({
        where: { id: createdOrder.id }
      })
    }

    await prisma.requestItem.deleteMany({
      where: { requestId: testRequest.id }
    })

    await prisma.request.delete({
      where: { id: testRequest.id }
    })

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [employee.id, manager.id]
        }
      }
    })

    await prisma.$disconnect()
  })

  it("should create order from approved request", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send({
        requestId: testRequest.id,
        managerId: manager.id
      })

    expect(res.statusCode).toBe(201)

    expect(res.body).toHaveProperty("id")
    expect(res.body.managerId).toBe(manager.id)

    createdOrder = res.body

    const updatedRequest = await prisma.request.findUnique({
      where: { id: testRequest.id }
    })

    expect(updatedRequest.orderId).toBe(createdOrder.id)
  })
})