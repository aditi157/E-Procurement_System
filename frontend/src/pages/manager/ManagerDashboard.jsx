import React, { useEffect, useState } from 'react'
import ManagerSidebar from './ManagerSidebar'
import IncomingRequests from './IncomingRequests'
import ApprovedRequests from './ApprovedRequests'
import { getAllRequests } from '../../services/requestService'
import Orders from './Orders'
import Auctions from './Auctions'


const ManagerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'))
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [requests, setRequests] = useState([])

  useEffect(() => {
    setRequests(getAllRequests())
  }, [])

  const incoming = requests.filter(r => r.status === 'Submitted')
  const approved = requests.filter(r => r.status === 'Approved')

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
          Logged in as <strong>{user.email}</strong>
        </p>

        {activeMenu === 'dashboard' && (
          <div className="section">
            <p>Incoming Requests: {incoming.length}</p>
            <p>Approved Requests: {approved.length}</p>
          </div>
        )}

        {activeMenu === 'incoming' && (
          <IncomingRequests
            requests={incoming}
            refresh={() => setRequests(getAllRequests())}
          />
        )}

        {activeMenu === 'approved' && (
          <ApprovedRequests requests={approved} />
        )}

        {activeMenu === 'orders' && <Orders />}

        {activeMenu === 'auctions' && <Auctions />}

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
