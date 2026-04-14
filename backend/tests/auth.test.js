import request from "supertest"
import app from "../src/app.js"

describe("Authentication", () => {
  test("Register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Auth Test",
        email: "auth@test.com",
        password: "password123",
        role: "EMPLOYEE"
      })

    expect(res.statusCode).toBe(201)
  })

  test("Login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "auth@test.com",
        password: "password123"
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("token")
  })

  test("Reject invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "auth@test.com",
        password: "wrong"
      })

    expect(res.statusCode).toBe(400)
  })
})