import React, { useEffect, useState } from 'react'
import ManagerSidebar from './ManagerSidebar'
import IncomingRequests from './IncomingRequests'
import ApprovedRequests from './ApprovedRequests'
import Orders from './Orders'
import Auctions from './Auctions'
import axios from 'axios'
import { useToast } from '../../context/ToastContext'

const ManagerDashboard = () => {
  const toast = useToast()
  const [activeMenu, setActiveMenu]       = useState('dashboard')
  const [requests, setRequests]           = useState([])
  const [ordersCount, setOrdersCount]     = useState(0)
  const [auctionsCount, setAuctionsCount] = useState(0)

  const user = JSON.parse(localStorage.getItem('user'))

  const loadRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/manager/requests')
      const formatted = res.data.map(r => ({
        id: r.id,
        requestedBy: r.employee.email,
        items: r.items.map(i => ({
          id: i.id, name: i.name, quantity: i.quantity, price: i.unitPrice
        })),
        status: r.status,
        createdAt: r.createdAt,
      }))
      setRequests(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { loadRequests(); loadCounts() }, [])

  const loadCounts = async () => {
    try {
      const [ordersRes, auctionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders'),
        axios.get('http://localhost:5000/api/auctions'),
      ])
      setOrdersCount(ordersRes.data.length)
      setAuctionsCount(auctionsRes.data.length)
    } catch (err) {
      console.error(err)
    }
  }


  const incoming = requests.filter(r => r.status === 'PENDING')
  const approved = requests.filter(r => r.status === 'APPROVED')

  const handleDecision = async (requestId, status) => {
    try {
      await axios.post(
        `http://localhost:5000/api/manager/request/${requestId}`,
        { status, managerId: user.id }
      )
      loadRequests()
      toast(
        status === 'APPROVED' ? 'Request approved' : 'Request rejected',
        status === 'APPROVED' ? 'success' : 'error'
      )
    } catch (err) {
      console.error(err)
      toast('Failed to update request', 'error')
    }
  }

  const pageTitles = {
    dashboard: 'Dashboard', incoming: 'Incoming Requests',
    approved: 'Approved Requests', orders: 'Orders',
    auctions: 'Auctions', profile: 'Profile',
  }

  return (
    <div className="dashboard-layout">
      <ManagerSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="dashboard-content">
        <h1 className="title">{pageTitles[activeMenu] || 'Dashboard'}</h1>
        <p className="subtitle">Logged in as <strong>{user?.email}</strong></p>

        {activeMenu === 'dashboard' && (
          <div className="stat-row">
            <div className="stat-card stat-amber">
              <div className="stat-label">Incoming Requests</div>
              <div className="stat-value">{incoming.length}</div>
            </div>
            <div className="stat-card stat-teal">
              <div className="stat-label">Approved</div>
              <div className="stat-value">{approved.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{requests.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Orders</div>
              <div className="stat-value">{ordersCount}</div>
            </div>
            <div className="stat-card stat-rose">
              <div className="stat-label">Total Auctions</div>
              <div className="stat-value">{auctionsCount}</div>
            </div>
          </div>
        )}

        {activeMenu === 'incoming' && (
          <IncomingRequests
            requests={incoming}
            onApprove={id => handleDecision(id, 'APPROVED')}
            onReject={id => handleDecision(id, 'REJECTED')}
            refresh={loadRequests}
          />
        )}

        {activeMenu === 'approved' && <ApprovedRequests requests={approved} />}
        {activeMenu === 'orders'   && <Orders />}
        {activeMenu === 'auctions' && <Auctions />}

        {activeMenu === 'profile' && (
          <div className="profile-card">
            <h2>{user?.name}</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong>  {user?.role}</p>
            <p><strong>Organization:</strong> {user?.orgName || 'N/A'}</p>
            {user?.createdAt && (
              <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagerDashboard