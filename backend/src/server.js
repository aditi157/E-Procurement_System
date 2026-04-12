import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import employeeRoutes from "./routes/employee.routes.js"
import managerRoutes from "./routes/manager.routes.js"
import orderRoutes from "./routes/order.routes.js"
import auctionRoutes from "./routes/auction.routes.js"
import vendorRoutes from "./routes/vendor.routes.js"
import financeRoutes from "./routes/finance.routes.js"


const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

// routes
app.use("/api/auth", authRoutes)
app.use("/api/employee", employeeRoutes)
app.use("/api/manager", managerRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auctions", auctionRoutes)
app.use("/api/vendor", vendorRoutes)
app.use("/api/finance", financeRoutes)

app.listen(5000, () => {
  console.log("Server running on port 5000")
})