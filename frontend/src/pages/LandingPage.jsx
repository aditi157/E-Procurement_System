import React from 'react'
import { useNavigate } from 'react-router-dom'
import RoleCard from '../components/RoleCard'

/*
  LandingPage
  - Entry point of the system
  - User selects their role before logging in
*/
const LandingPage = () => {
  const navigate = useNavigate()

  // Redirect user to login with selected role
  const handleRoleSelect = (role) => {
    navigate('/login', { state: { role } })
  }

  return (
    <div className="app-container">
      {/* System title */}
      <h1 className="title">E-Procurement System</h1>

      {/* Short description */}
      <p className="subtitle">
        A centralized platform to manage purchase requests, approvals,
        vendor coordination, and payments within an organization.
      </p>

      {/* Role selection cards */}
      <div className="card-container">
        <RoleCard
          title="Employee"
          description="Request items and track purchase request status."
          onClick={() => handleRoleSelect('Employee')}
        />

        <RoleCard
          title="Manager / Procurement"
          description="Review requests, approve purchases, and manage vendors."
          onClick={() => handleRoleSelect('Manager')}
        />

        <RoleCard
          title="Vendor"
          description="View purchase orders, update deliveries, and submit invoices."
          onClick={() => handleRoleSelect('Vendor')}
        />

        <RoleCard
          title="Finance"
          description="Verify invoices and process payments."
          onClick={() => handleRoleSelect('Finance')}
        />
      </div>
    </div>
  )
}

export default LandingPage
