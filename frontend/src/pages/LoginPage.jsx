import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import fakeUsers from '../data/fakeUsers'

/*
  LoginPage
  - Authenticates user
  - Redirects based on role
*/
const LoginPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedRole = location.state?.role || 'User'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    const user = fakeUsers.find(
      (u) => u.email === email && u.role === selectedRole
    )

    if (!user) {
      setError('No account found for this role and email.')
      return
    }

    if (user.password !== password) {
      setError('Incorrect password.')
      return
    }

    // Save user session
    localStorage.setItem('loggedInUser', JSON.stringify(user))

    // Role-based redirect
    if (user.role === 'Employee') navigate('/employee')
    if (user.role === 'Manager') navigate('/manager')
    if (user.role === 'Vendor') navigate('/vendor')
    if (user.role === 'Finance') navigate('/finance')
  }

  return (
    <div className="app-container">
      <h1 className="title">{selectedRole} Login</h1>

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
      </form>
    </div>
  )
}

export default LoginPage
