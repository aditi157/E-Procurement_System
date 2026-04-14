import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

describe("Procurement Workflow Integration", () => {
  let employee
  let manager
  let createdRequest

  beforeAll(async () => {
    employee = await prisma.user.create({
      data: {
        name: "Workflow Employee",
        email: `employee-${Date.now()}@test.com`,
        password: "hashed",
        role: "EMPLOYEE",
        orgName: "Test Org"
      }
    })

    manager = await prisma.user.create({
      data: {
        name: "Workflow Manager",
        email: `manager-${Date.now()}@test.com`,
        password: "hashed",
        role: "MANAGER",
        orgName: "Test Org"
      }
    })
  })

  it("should create procurement request", async () => {
    const res = await request(app)
      .post("/api/employee/request")
      .send({
        title: "Laptop Procurement",
        description: "Need laptops",
        employeeId: employee.id,
        items: [
          {
            name: "Laptop",
            quantity: 2,
            unitPrice: 50000
          }
        ]
      })

    expect(res.statusCode).toBe(201)

    createdRequest = res.body

    expect(createdRequest.title).toBe("Laptop Procurement")
  })

  it("should approve previously created request", async () => {
    const res = await request(app)
      .post(`/api/manager/request/${createdRequest.id}`)
      .send({
        status: "APPROVED",
        managerId: manager.id,
        comments: "Approved by manager"
      })

    expect(res.statusCode).toBe(200)

    const updatedRequest = await prisma.request.findUnique({
      where: { id: createdRequest.id }
    })

    expect(updatedRequest.status).toBe("APPROVED")

    const approval = await prisma.approval.findFirst({
      where: {
        requestId: createdRequest.id,
        managerId: manager.id
      }
    })

    expect(approval).not.toBeNull()
  })
})