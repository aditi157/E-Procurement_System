import request from "supertest"
import app from "../src/app.js"
import prisma from "../src/config/db.js"

describe("Auction Workflow", () => {
  let manager
  let vendor
  let auction

  beforeAll(async () => {
    manager = await prisma.user.create({
      data: {
        name: "Auction Manager",
        email:  `auctionManager-${Date.now()}@test.com`,
        password: "pass",
        role: "MANAGER",
        orgName: "Test Org"
      }
    })

    vendor = await prisma.user.create({
      data: {
        name: "Auction Vendor",
        email: `auction-vendor-${Date.now()}@test.com`,
        password: "pass",
        role: "VENDOR",
        orgName: "Test Org"
      }
    })
  })

  test("Create auction", async () => {
    const res = await request(app)
      .post("/api/auctions")
      .send({
        name: "Laptop Auction",
        description: "Bulk laptops",
        managerId: manager.id,
        endDate: new Date(Date.now() + 86400000),
        deliveryDate: new Date(Date.now() + 172800000),
        items: [
          { name: "Laptop", quantity: 10 }
        ]
      })

    expect(res.statusCode).toBe(200)

    auction = res.body
  })

  test("Submit bid", async () => {
    const res = await request(app)
      .post(`/api/auctions/${auction.id}/bid`)
      .send({
        vendorId: vendor.id,
        amount: 50000,
        deliveryDate: new Date(),
        notes: "Fast delivery"
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.amount).toBe(50000)
  })

  test("Prevent duplicate bid", async () => {
    const res = await request(app)
      .post(`/api/auctions/${auction.id}/bid`)
      .send({
        vendorId: vendor.id,
        amount: 60000,
        deliveryDate: new Date()
      })

    expect(res.statusCode).toBe(400)
  })
})