import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

describe("Employee Request API", () => {
  let employee

  beforeAll(async () => {
    employee = await prisma.user.create({
      data: {
        name: "Test Employee",
        email: `employee-${Date.now()}@test.com`,
        password: "hashedpassword",
        role: "EMPLOYEE",
        orgName: "Test Org"
      }
    })
  })

  it("should create procurement request", async () => {
    const res = await request(app)
      .post("/api/employee/request")
      .send({
        title: "Laptop Procurement",
        description: "Need laptops for dev team",
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
    expect(res.body.title).toBe("Laptop Procurement")
  })
})