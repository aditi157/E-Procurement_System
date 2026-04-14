import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE"
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post("http://localhost:5000/api/auth/register", form)
      alert("Registered successfully")
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Registration failed")
    }
  }

  return (
    <div className="app-container">
      <div className="register-card">
        <h2 className="title">Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <div>
          <select name="role" onChange={handleChange}>
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="VENDOR">Vendor</option>
            <option value="FINANCE">Finance</option>
          </select>
          </div>
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: "600" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}