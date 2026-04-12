import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      )

      const { user, token } = res.data

      // Save user + token
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      // Role-based redirect (IMPORTANT: match backend roles)
      if (user.role === 'EMPLOYEE') navigate('/employee')
      if (user.role === 'MANAGER') navigate('/manager')
      if (user.role === 'VENDOR') navigate('/vendor')
      if (user.role === 'FINANCE') navigate('/finance')

    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="app-container">
      <h1 className="title">Login</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}
        <button type="submit">Login</button>

        <p style={{ marginTop: "16px", fontSize: "14px" }}>
        Don’t have an account?{" "}
        <span
          style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
          onClick={() => navigate("/register")}
        >
          Register instead
        </span>
      </p>

      </form>
    </div>
  )
}

export default LoginPage