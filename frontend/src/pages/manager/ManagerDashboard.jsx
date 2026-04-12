import React, { useEffect, useState } from 'react'
import ManagerSidebar from './ManagerSidebar'
import IncomingRequests from './IncomingRequests'
import ApprovedRequests from './ApprovedRequests'
import Orders from './Orders'
import Auctions from './Auctions'
import axios from "axios"

const ManagerDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [requests, setRequests] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  /* ---------- LOAD FROM BACKEND ---------- */
  const loadRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/manager/requests"
      )

      const formatted = res.data.map(r => ({
        id: r.id,
        requestedBy: r.employee.email,
        items: r.items.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.unitPrice
        })),
        status: r.status, // PENDING / APPROVED / REJECTED
        createdAt: r.createdAt
      }))

      setRequests(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  /* ---------- FIXED STATUS FILTERS ---------- */
  const incoming = requests.filter(r => r.status === 'PENDING')
  const approved = requests.filter(r => r.status === 'APPROVED')

  /* ---------- APPROVE / REJECT ---------- */
  const handleDecision = async (requestId, status) => {
    try {
      await axios.post(
        `http://localhost:5000/api/manager/request/${requestId}`,
        {
          status,
          managerId: user.id
        }
      )

      loadRequests()
    } catch (err) {
      console.error(err)
      alert("Failed to update")
    }
  }

  return (
    <div className="dashboard-layout">
      <ManagerSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="dashboard-content">
        <h1 className="title">
          {activeMenu === 'dashboard'
            ? 'Dashboard'
            : activeMenu === 'incoming'
            ? 'Incoming Requests'
            : activeMenu === 'approved'
            ? 'Approved Requests'
            : activeMenu === 'orders'
            ? 'Orders'
            : activeMenu === 'auctions'
            ? 'Auctions'
            : 'Profile'}
        </h1>

        <p className="subtitle">
          Logged in as <strong>{user?.email}</strong>
        </p>

        {/* DASHBOARD */}
        {activeMenu === 'dashboard' && (
          <div className="section">
            <p>Incoming Requests: {incoming.length}</p>
            <p>Approved Requests: {approved.length}</p>
          </div>
        )}

        {/* INCOMING */}
        {activeMenu === 'incoming' && (
          <IncomingRequests
            requests={incoming}
            onApprove={(id) => handleDecision(id, "APPROVED")}
            onReject={(id) => handleDecision(id, "REJECTED")}
            refresh={loadRequests}
          />
        )}

        {/* APPROVED */}
        {activeMenu === 'approved' && (
          <ApprovedRequests requests={approved} />
        )}

        {/* OTHER SECTIONS */}
        {activeMenu === 'orders' && <Orders />}
        {activeMenu === 'auctions' && <Auctions />}

        {/* PROFILE */}
        {activeMenu === 'profile' && (
          <div className="section">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagerDashboard