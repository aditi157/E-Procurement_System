import React, { useEffect, useState } from 'react'
import EmployeeSidebar from './EmployeeSidebar'
import {
  getRequestsByEmployee,
  createRequest
} from '../../services/requestService'

const EmployeeDashboard = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'))

  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)

  /* ---------- STATIC CATALOG ---------- */
  const catalog = [
    { id: 'IT-001', name: 'Laptop', price: 70000 },
    { id: 'IT-002', name: 'Monitor', price: 15000 },
    { id: 'IT-003', name: 'Keyboard', price: 2500 },
    { id: 'IT-004', name: 'Mouse', price: 1200 }
  ]

  /* ---------- LOAD REQUESTS ---------- */
  useEffect(() => {
    setRequests(getRequestsByEmployee(user.email))
  }, [user.email])

  /* ---------- CART LOGIC ---------- */
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    )
  }

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const submitRequest = () => {
    if (cart.length === 0) return

    const newRequest = {
      id: `REQ-${Date.now()}`,
      requestedBy: user.email,
      department: user.department || 'General',
      items: cart,
      justification: 'Office requirement',
      status: 'Submitted',
      createdAt: new Date().toISOString()
    }

    createRequest(newRequest)
    setRequests(getRequestsByEmployee(user.email))
    setCart([])
    setShowCart(false)
    setActiveMenu('requests')
  }

  /* ---------- FILTERED VIEWS ---------- */

  // Active = NOT completed AND NOT rejected
  const activeRequests = requests.filter(
    (r) =>
      r.status !== 'Completed' &&
      !r.status.toLowerCase().includes('reject')
  )

  // History = completed OR rejected
  const historyRequests = requests.filter(
    (r) =>
      r.status === 'Completed' ||
      r.status.toLowerCase().includes('reject')
  )

  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'catalog':
        return 'Catalog'
      case 'requests':
        return 'My Requests'
      case 'history':
        return 'Request History'
      case 'profile':
        return 'My Profile'
      default:
        return 'Dashboard'
    }
  }

  return (
    <div className="dashboard-layout">
      <EmployeeSidebar
  activeMenu={activeMenu}
  setActiveMenu={setActiveMenu}
/>


      <div className="dashboard-content">
        <h1 className="title">{getPageTitle()}</h1>
        <p className="subtitle">
          Logged in as <strong>{user.email}</strong>
        </p>

        {/* CART ICON */}
        {activeMenu === 'catalog' && (
          <div className="top-actions">
            <button
              className="cart-button"
              onClick={() => setShowCart((p) => !p)}
            >
              🛒 Cart ({cart.length})
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {activeMenu === 'dashboard' && (
          <div className="section">
            <p>Total Requests: {requests.length}</p>
            <p>Active Requests: {activeRequests.length}</p>
            <p>History Requests: {historyRequests.length}</p>
          </div>
        )}

        {/* CATALOG */}
        {activeMenu === 'catalog' && (
          <div className="catalog-grid">
            {catalog.map((item) => (
              <div key={item.id} className="catalog-card">
                <h3>{item.name}</h3>
                <p className="price">₹{item.price}</p>
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MY REQUESTS (ACTIVE ONLY) */}
        {activeMenu === 'requests' && (
          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {activeRequests.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{r.id}</td>
                  <td>{r.status}</td>
                  <td>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      
        
        {/* REQUEST HISTORY (COMPLETED + REJECTED) */}
        {activeMenu === 'history' && (
          <table className="records-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {historyRequests.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{r.id}</td>
                  <td>{r.status}</td>
                  <td>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PROFILE */}
        {activeMenu === 'profile' && (
          <div className="section">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p>
              <strong>Department:</strong>{' '}
              {user.department || 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Request Details</h2>

            <p><strong>ID:</strong> {selectedRequest.id}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(
                selectedRequest.createdAt
              ).toLocaleString()}
            </p>

            <h3 style={{ marginTop: '16px' }}>Items</h3>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>₹{i.price * i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="cart-total">
              Total: ₹{totalAmount(selectedRequest.items)}
            </p>

            <button
              className="modal-close"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div
          className="modal-overlay"
          onClick={() => setShowCart(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Your Cart</h2>

            {cart.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((i) => (
                      <tr key={i.id}>
                        <td>{i.name}</td>
                        <td>
                          <button onClick={() => decreaseQty(i.id)}>-</button>
                          {i.quantity}
                          <button onClick={() => increaseQty(i.id)}>+</button>
                        </td>
                        <td>₹{i.price * i.quantity}</td>
                        <td>
                          <button onClick={() => removeItem(i.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="cart-total">
                  Total: ₹{totalAmount(cart)}
                </p>

                <button onClick={submitRequest}>
                  Create Purchase Request
                </button>
              </>
            )}

            <button
              className="modal-close"
              onClick={() => setShowCart(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboard
