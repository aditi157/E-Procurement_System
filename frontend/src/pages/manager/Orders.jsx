import React, { useEffect, useState } from 'react'
import CreateDraftModal from './CreateDraftModal'
import OrderDetailsModal from './OrderDetailsModal'
import axios from "axios"

const statusClass = (s = '') => {
  const map = {
    draft: 'badge-draft', submitted: 'badge-submitted',
    accepted: 'badge-accepted', rejected: 'badge-rejected',
    delivered: 'badge-delivered', cancelled: 'badge-cancelled',
  }
  return map[s.toLowerCase()] || 'badge-draft'
}

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [editingDraft, setEditingDraft] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState(null)

  const [submittingOrder, setSubmittingOrder] = useState(null)
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState("")

const cancelOrder = async (order) => {
  try {
    await axios.post(
      `http://localhost:5000/api/orders/${order.id}/cancel`
    )

    loadOrders()              
    setSelectedOrder(null)    

  } catch (err) {
    console.error(err)
    alert("Failed to cancel order")
  }
}


  /* ---------- LOAD ORDERS ---------- */
  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders")

      const formatted = res.data.map(o => ({
        id: o.id,
        name: o.name,
        status: o.status.toLowerCase(),
        createdAt: o.createdAt,
        items: o.items || [],
        vendor: o.vendor?.name || "-"
      }))

      setOrders(formatted)

    } catch (err) {
      console.error(err)
    }
  }

  /* ---------- LOAD VENDORS ---------- */
  const loadVendors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auctions/vendors/list")
      setVendors(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadOrders()
    loadVendors()
  }, [])

  /* ---------- SUBMIT + ASSIGN ---------- */
 const submitAndAssign = async () => {
  if (!selectedVendor) return alert("Select vendor")

  try {
    console.log("Assigning vendor:", selectedVendor) // ✅ FIXED

    await axios.post(
      `http://localhost:5000/api/orders/${submittingOrder.id}/submit`,
      { vendorId: selectedVendor }
    )

    loadOrders()
    setSubmittingOrder(null)
    setSelectedVendor("")

  } catch (err) {
    console.error(err)
  }
}

const activeOrders = orders.filter(o =>
  ['draft', 'submitted', 'accepted'].includes(o.status)
)
  
const historyOrders = orders.filter(o =>
  ['rejected', 'delivered', 'cancelled'].includes(o.status)
)

  return (
    <>
      <div className="top-actions">
        <button
          className="cart-button"
          onClick={() => setShowCreate(true)}
        >
          + Create Order Draft
        </button>
      </div>

      {/* ACTIVE */}
      <div className="section">
        <h2>Orders</h2>

        {activeOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📦</span>
            <strong>No active orders</strong>
            Create a draft to get started.
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Vendor</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map(o => (
                <tr
                  key={o.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedOrder(o)}
                >
                  <td>{o.name}</td>
                  <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                  <td>{o.vendor || "-"}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* HISTORY */}
      <div className="section">
        <h2>Order History</h2>

        {historyOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🗂️</span>
            <strong>No completed orders yet</strong>
            Delivered and cancelled orders will appear here.
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Vendor</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {historyOrders.map(o => (
                <tr
                  key={o.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedOrder(o)}
                >
                  <td>{o.name}</td>
                  <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                  <td>{o.vendor || "-"}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAssign={(order) => {
            setSelectedOrder(null)
            setSubmittingOrder(order)
          }}
        onCancel={cancelOrder}
        />
      )}

      {/* ASSIGN MODAL */}
      {submittingOrder && (
        <div className="modal-overlay" onClick={() => setSubmittingOrder(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Assign Vendor</h2>

            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
            >
              <option value="">Select vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>
                  {v.email}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="primary-btn" onClick={submitAndAssign}>
                Submit & Assign
              </button>

              <button class="modal-close" onClick={() => setSubmittingOrder(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(showCreate || editingDraft) && (
        <CreateDraftModal
          existingDraft={editingDraft}
          onClose={() => {
            setShowCreate(false)
            setEditingDraft(null)
            loadOrders()
          }}
        />
      )}
    </>
  )
}

export default Orders