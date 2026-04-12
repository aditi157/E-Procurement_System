import prisma from "../config/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    })

    res.status(201).json({
      message: "User registered",
      user
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Registration failed" })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1d" }
    )

    res.json({
      message: "Login successful",
      token,
      user
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Login failed" })
  }
}


export const getMe = async (req, res) => {
  try {
    const { id } = req.user

    const user = await prisma.user.findUnique({
      where: { id }
    })

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" })
  }
}