import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VendorSidebar from './VendorSidebar'
import VendorOrderModal from './VendorOrderModal'
import VendorAuctionModal from './VendorAuctionModal'
import VendorInvoices from './VendorInvoices'
import { useToast } from '../../context/ToastContext'

const statusClass = (s = '') => {
  const map = {
    SUBMITTED: 'badge-submitted', ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected',   DELIVERED: 'badge-delivered',
    COMPLETED: 'badge-completed', SELECTED: 'badge-selected',
  }
  return map[s] || 'badge-draft'
}

const VendorDashboard = () => {
  const toast = useToast()
  const [activeMenu, setActiveMenu]       = useState('dashboard')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [orders, setOrders]               = useState([])
  const [auctions, setAuctions]           = useState([])

  const user = JSON.parse(localStorage.getItem('user'))

  const loadOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/vendor/orders/${user.id}`)
      setOrders(res.data)
    } catch (err) { console.error(err) }
  }

  const loadAuctions = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/vendor/auctions/${user.id}`)
      setAuctions(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { loadOrders(); loadAuctions() }, [])

  const acceptOrder = async (orderId) => {
    await axios.post(`http://localhost:5000/api/vendor/orders/${orderId}/accept`)
    loadOrders()
    toast('Order accepted', 'success')
  }

  const rejectOrder = async (orderId) => {
    await axios.post(`http://localhost:5000/api/vendor/orders/${orderId}/reject`)
    loadOrders()
    toast('Order rejected', 'error')
  }

  // const markDelivered = async (orderId) => {
  //   await axios.post(`http://localhost:5000/api/vendor/orders/${orderId}/deliver`)
  //   loadOrders()
  //   toast('Order marked as delivered', 'success')
  // }

  const markDelivered = async (orderId) => {
  try {
    await axios.post(
      `http://localhost:5000/api/vendor/orders/${orderId}/deliver`
    )

    await loadOrders()
    toast('Order marked as delivered', 'success')

  } catch (err) {
    console.error("DELIVER ERROR:", err.response?.data || err)
    toast(err.response?.data?.error || 'Failed to mark delivered', 'error')
  }
}

  const activeOrders  = orders.filter(o => ['SUBMITTED','ACCEPTED'].includes(o.status))
  const historyOrders = orders.filter(o => ['REJECTED','DELIVERED'].includes(o.status))
  const now = new Date()
  const activeAuctions  = auctions.filter(a =>
    !['COMPLETED','SELECTED','REJECTED'].includes(a.status) && new Date(a.endDate) > now
  )
  const auctionHistory  = auctions.filter(a =>
    ['COMPLETED','SELECTED','REJECTED'].includes(a.status) || new Date(a.endDate) <= now
  )

  const pageTitles = {
    dashboard: 'Vendor Dashboard', orders: 'Orders',
    auctions: 'Auctions', invoices: 'Invoices', profile: 'Profile',
  }

  return (
    <div className="dashboard-layout">
      <VendorSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="dashboard-content">
        <h1 className="title">{pageTitles[activeMenu] || 'Dashboard'}</h1>
        <p className="subtitle">Logged in as <strong>{user?.email}</strong></p>

        {/* ── DASHBOARD STATS ── */}
        {activeMenu === 'dashboard' && (
          <div className="stat-row">
            <div className="stat-card stat-amber">
              <div className="stat-label">Active Orders</div>
              <div className="stat-value">{activeOrders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Auction Invites</div>
              <div className="stat-value">{auctions.length}</div>
            </div>
            <div className="stat-card stat-teal">
              <div className="stat-label">Delivered</div>
              <div className="stat-value">{historyOrders.filter(o => o.status === 'DELIVERED').length}</div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeMenu === 'orders' && (
          <div className="section">
            <h2>Assigned Orders</h2>
            {activeOrders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">📦</span>
                <strong>No active orders</strong>
                Orders assigned to you will appear here.
              </div>
            ) : (
              <table className="records-table">
                <thead>
                  <tr><th>Order</th><th>Status</th><th>Items</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {activeOrders.map(o => (
                    <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)}>
                      <td>{o.name}</td>
                      <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                      <td>{o.items.map(i => i.name).join(', ')}</td>
                      <td onClick={e => e.stopPropagation()}>
                        {o.status === 'SUBMITTED' && (
                          <>
                            <button className="primary-btn btn-success" style={{ marginRight: 8 }} onClick={() => acceptOrder(o.id)}>Accept</button>
                            <button className="primary-btn btn-danger" onClick={() => rejectOrder(o.id)}>Reject</button>
                          </>
                        )}
                        {o.status === 'ACCEPTED' && (
                          <button className="primary-btn btn-success" onClick={() => markDelivered(o.id)}>Mark Delivered</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h2 style={{ marginTop: 40 }}>Order History</h2>
            {historyOrders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🗂️</span>
                <strong>No completed orders yet</strong>
              </div>
            ) : (
              <table className="records-table">
                <thead><tr><th>Order</th><th>Status</th></tr></thead>
                <tbody>
                  {historyOrders.map(o => (
                    <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)}>
                      <td>{o.name}</td>
                      <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── AUCTIONS ── */}
        {activeMenu === 'auctions' && (
          <div className="section">
            <h2>Invited Auctions</h2>
            {activeAuctions.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🏷️</span>
                <strong>No active auction invites</strong>
              </div>
            ) : (
              <table className="records-table">
                <thead><tr><th>Name</th><th>Organization</th><th>Closes</th><th>Delivery</th></tr></thead>
                <tbody>
                  {activeAuctions.map(a => (
                    <tr key={a.id} onClick={() => setSelectedAuction(a)} style={{ cursor: 'pointer' }}>
                      <td>{a.name}</td>
                      <td>{a.manager?.orgName || a.manager?.orgName || '—'}</td>
                      <td>{new Date(a.endDate).toLocaleString()}</td>
                      <td>{new Date(a.deliveryDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <h2 style={{ marginTop: 40 }}>Auction History</h2>
            {auctionHistory.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🗂️</span>
                <strong>No auction history</strong>
              </div>
            ) : (
              <table className="records-table">
                <thead><tr><th>Name</th><th>Organization</th><th>Status</th><th>Closed</th></tr></thead>
                <tbody>
                  {auctionHistory.map(a => (
                    <tr key={a.id} onClick={() => setSelectedAuction(a)} style={{ cursor: 'pointer' }}>
                      <td>{a.name}</td>
                      <td>{a.manager?.orgName || a.manager?.orgName || '—'}</td>
                      <td><span className={`badge ${statusClass(a.status)}`}>{a.status}</span></td>
                      <td>{new Date(a.endDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeMenu === 'invoices' && <VendorInvoices />}

        {activeMenu === 'profile' && (
          <div className="section">
            <p><strong>Name:</strong>   {user?.name}</p>
            <p><strong>Email:</strong>  {user?.email}</p>
            <p><strong>Role:</strong>   {user?.role}</p>
            <p><strong>Orders Fulfilled:</strong> {historyOrders.filter(o => o.status === 'DELIVERED').length}</p>
            <p><strong>Active Orders:</strong> {activeOrders.length}</p>
            <p><strong>Auction Invites:</strong> {auctions.length}</p>
            {user?.createdAt && (
              <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        )}

        {selectedOrder && (
          <VendorOrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
        {selectedAuction && (
          <VendorAuctionModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />
        )}
      </div>
    </div>
  )
}

export default VendorDashboard