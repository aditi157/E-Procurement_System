import React, { useEffect, useState } from 'react'
import EmployeeSidebar from './EmployeeSidebar'
import axios from 'axios'
import { useToast } from '../../context/ToastContext'

/* ─── tiny helper ───────────────────────────────────────────────────────── */
const statusClass = (s = '') => {
  const map = {
    PENDING: 'badge-pending', APPROVED: 'badge-approved',
    REJECTED: 'badge-rejected', Completed: 'badge-completed',
    completed: 'badge-completed', approved: 'badge-approved',
    pending: 'badge-pending', rejected: 'badge-rejected',
  }
  return map[s] || 'badge-draft'
}

const EmployeeDashboard = () => {
  const toast = useToast()

  const [user, setUser]               = useState(null)
  const [activeMenu, setActiveMenu]   = useState('dashboard')
  const [cart, setCart]               = useState([])
  const [showCart, setShowCart]       = useState(false)
  const [requests, setRequests]       = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data)
      localStorage.setItem('user', JSON.stringify(res.data))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { fetchUser() }, [])

  /* ─── STATIC CATALOG ──────────────────────────────────────────────────── */
  const catalog = [
    { id: 'IT-001', name: 'Laptop',   price: 70000 },
    { id: 'IT-002', name: 'Monitor',  price: 15000 },
    { id: 'IT-003', name: 'Keyboard', price: 2500  },
    { id: 'IT-004', name: 'Mouse',    price: 1200  },
  ]

  /* ─── LOAD REQUESTS ───────────────────────────────────────────────────── */
  const loadRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/employee/request/${user.id}`
      )
      const formatted = res.data.map(r => ({
        id: r.id,
        requestedBy: user.email,
        department: user.department || 'General',
        items: r.items.map(i => ({
          id: i.id, name: i.name, quantity: i.quantity, price: i.unitPrice
        })),
        justification: r.description || '',
        status: r.status,
        createdAt: r.createdAt,
      }))
      setRequests(formatted)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { if (user) loadRequests() }, [user])

  /* ─── CART LOGIC ──────────────────────────────────────────────────────── */
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        toast(`Increased ${item.name} quantity`, 'info')
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      toast(`${item.name} added to cart`, 'success')
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const increaseQty = (id) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i))

  const decreaseQty = (id) =>
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0)
    )

  const removeItem = (id) => {
    const item = cart.find(i => i.id === id)
    setCart(prev => prev.filter(i => i.id !== id))
    if (item) toast(`${item.name} removed from cart`, 'warning')
  }

  /* ─── SUBMIT REQUEST ──────────────────────────────────────────────────── */
  const submitRequest = async () => {
    if (cart.length === 0) return
    try {
      await axios.post('http://localhost:5000/api/employee/request', {
        title: 'Purchase Request',
        description: 'From cart',
        employeeId: user.id,
        items: cart.map(i => ({
          name: i.name, quantity: i.quantity, unitPrice: i.price
        })),
      })
      setCart([])
      setShowCart(false)
      setActiveMenu('requests')
      loadRequests()
      toast('Purchase request submitted!', 'success')
    } catch (err) {
      console.error(err)
      toast('Failed to create request', 'error')
    }
  }

  /* ─── FILTERS ─────────────────────────────────────────────────────────── */
  const activeRequests  = requests.filter(r =>
    ['PENDING', 'APPROVED'].includes(r.status)
  )
  const historyRequests = requests.filter(r =>
    ['REJECTED', 'COMPLETED', 'FULFILLED'].includes(r.status)
  )
  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const getPageTitle = () => {
    const titles = {
      catalog: 'Catalog', requests: 'My Requests',
      history: 'Request History', profile: 'My Profile',
    }
    return titles[activeMenu] || 'Dashboard'
  }

  return (
    <div className="dashboard-layout">
      <EmployeeSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="dashboard-content">
        <h1 className="title">{getPageTitle()}</h1>
        <p className="subtitle">
          Logged in as <strong>{user?.name}</strong>
        </p>

        {/* ── CART BUTTON ── */}
        {activeMenu === 'catalog' && (
          <div className="top-actions">
            <button className="cart-button" onClick={() => setShowCart(p => !p)}>
              🛒 Cart ({cart.length})
            </button>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeMenu === 'dashboard' && (
          <div className="stat-row">
            <div className="stat-card">
              <div className="stat-label">Total Requests</div>
              <div className="stat-value">{requests.length}</div>
            </div>
            <div className="stat-card stat-amber">
              <div className="stat-label">Active</div>
              <div className="stat-value">{activeRequests.length}</div>
            </div>
            <div className="stat-card stat-teal">
              <div className="stat-label">Completed / Rejected</div>
              <div className="stat-value">{historyRequests.length}</div>
            </div>
            <div className="stat-card stat-rose">
              <div className="stat-label">Total Requested Value</div>
              <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                ₹{requests.reduce((sum, r) =>
                  sum + r.items.reduce((s, i) => s + i.price * i.quantity, 0), 0
                ).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* ── CATALOG ── */}
        {activeMenu === 'catalog' && (
          <div className="catalog-grid">
            {catalog.map(item => (
              <div key={item.id} className="catalog-card">
                <h3>{item.name}</h3>
                <p className="price">₹{item.price.toLocaleString('en-IN')}</p>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        )}

        {/* ── ACTIVE REQUESTS ── */}
        {activeMenu === 'requests' && (
          activeRequests.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📋</span>
              <strong>No active requests</strong>
              Browse the catalog to create a new purchase request.
            </div>
          ) : (
            <table className="records-table">
              <thead><tr><th>ID</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {activeRequests.map(r => (
                  <tr key={r.id} onClick={() => setSelectedRequest(r)} style={{ cursor: 'pointer' }}>
                    <td>{r.id}</td>
                    <td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {/* ── HISTORY ── */}
        {activeMenu === 'history' && (
          historyRequests.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🗂️</span>
              <strong>No history yet</strong>
              Completed and rejected requests will appear here.
            </div>
          ) : (
            <table className="records-table">
              <thead><tr><th>Request ID</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {historyRequests.map(r => (
                  <tr key={r.id} onClick={() => setSelectedRequest(r)} style={{ cursor: 'pointer' }}>
                    <td>{r.id}</td>
                    <td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {/* ── PROFILE ── */}
        {activeMenu === 'profile' && (
          <div className="profile-card">
            <h2>{user?.name}</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Department:</strong> {user?.department || 'N/A'}</p>
            <p><strong>Organization:</strong> {user?.orgName || 'N/A'}</p>
            {user?.createdAt && (
              <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>

      {/* ── REQUEST DETAILS MODAL ── */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Request Details</h2>
            <p><strong>ID:</strong> {selectedRequest.id}</p>
            <p><strong>Status:</strong> <span className={`badge ${statusClass(selectedRequest.status)}`}>{selectedRequest.status}</span></p>
            <p><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
            <p>
              <strong>Current Stage:</strong>{' '}
              {selectedRequest.status === 'PENDING'
                ? 'Awaiting Manager Approval'
                : selectedRequest.status === 'APPROVED'
                ? 'Approved — Procurement In Progress'
                : selectedRequest.status === 'REJECTED'
                ? 'Rejected by Manager'
                : selectedRequest.status === 'COMPLETED' || selectedRequest.status === 'FULFILLED'
                ? 'Fulfilled'
                : selectedRequest.status}
            </p>
            <h3>Items</h3>
            <table className="cart-table">
              <tbody>
                {selectedRequest.items.map(i => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>₹{i.price * i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cart-total">Total: ₹{totalAmount(selectedRequest.items).toLocaleString('en-IN')}</p>
            <button className="modal-close" onClick={() => setSelectedRequest(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ── CART MODAL ── */}
      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🛒</span>
                <strong>Cart is empty</strong>
                Add items from the catalog above.
              </div>
            ) : (
              <>
                <table className="cart-table">
                  <tbody>
                    {cart.map(i => (
                      <tr key={i.id}>
                        <td>{i.name}</td>
                        <td>
                          <button onClick={() => decreaseQty(i.id)}>−</button>
                          {i.quantity}
                          <button onClick={() => increaseQty(i.id)}>+</button>
                        </td>
                        <td>₹{(i.price * i.quantity).toLocaleString('en-IN')}</td>
                        <td><button onClick={() => removeItem(i.id)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="cart-total">Total: ₹{totalAmount(cart).toLocaleString('en-IN')}</p>
                <button className="primary-btn btn-success" onClick={submitRequest}>
                  Create Purchase Request
                </button>
              </>
            )}
            <button className="modal-close" onClick={() => setShowCart(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboard