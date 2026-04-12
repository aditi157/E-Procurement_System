import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  console.log("AUTH HEADER RECEIVED:", req.headers.authorization)

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "No token" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, "SECRET_KEY")
    req.user = decoded
    next()
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message)
    return res.status(401).json({ message: "Invalid token" })
  }
}