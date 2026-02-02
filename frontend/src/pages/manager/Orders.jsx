import React, { useEffect, useState } from 'react'
import CreateDraftModal from './CreateDraftModal'

const STORAGE_KEY = 'manager_orders'

const ACTIVE_STATUSES = [
  'Draft',
  'Submitted',
  'Assigned',
  'Fulfilled',
  'Invoiced'
]

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [editingDraft, setEditingDraft] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  // submit + assign flow
  const [submittingOrder, setSubmittingOrder] = useState(null)
  const [vendorId, setVendorId] = useState('')

  const loadOrders = () => {
    const stored =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    setOrders(stored)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const saveDraft = (draft) => {
    const updated = orders.some(o => o.id === draft.id)
      ? orders.map(o => (o.id === draft.id ? draft : o))
      : [...orders, draft]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setOrders(updated)
    setEditingDraft(null)
    setShowCreate(false)
  }

  /* ---------- SUBMIT + ASSIGN ---------- */
  const submitAndAssign = () => {
    if (!vendorId) return

    const updated = orders.map(o =>
      o.id === submittingOrder.id
        ? {
            ...o,
            status: 'Submitted',
            vendorId,
            submittedAt: new Date().toISOString()
          }
        : o
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setOrders(updated)
    setSubmittingOrder(null)
    setVendorId('')
  }

  const activeOrders = orders.filter(o =>
    ACTIVE_STATUSES.includes(o.status)
  )

  const historyOrders = orders.filter(o => o.status === 'Paid')

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

      {/* ===== ACTIVE ORDERS ===== */}
      <div className="section">
        <h2>Orders</h2>

        {activeOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Vendor</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map(o => (
                <tr key={o.id}>
                  <td
                    style={{
                      cursor:
                        o.status === 'Draft' ? 'pointer' : 'default'
                    }}
                    onClick={() =>
                      o.status === 'Draft' && setEditingDraft(o)
                    }
                  >
                    {o.name}
                  </td>
                  <td>{o.status}</td>
                  <td>{o.vendorId || '-'}</td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {o.status === 'Draft' && (
                      <button
                        onClick={() => setSubmittingOrder(o)}
                      >
                        Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== ORDER HISTORY ===== */}
      <div className="section">
        <h2>Order History</h2>

        {historyOrders.length === 0 ? (
          <p>No completed orders yet.</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Paid On</th>
              </tr>
            </thead>
            <tbody>
              {historyOrders.map(o => (
                <tr key={o.id}>
                  <td>{o.name}</td>
                  <td>
                    {o.paidAt
                      ? new Date(o.paidAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== SUBMIT → ASSIGN VENDOR MODAL ===== */}
      {submittingOrder && (
        <div
          className="modal-overlay"
          onClick={() => setSubmittingOrder(null)}
        >
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
          >
            <h2>Submit Order & Assign Vendor</h2>

            <p><strong>Order:</strong> {submittingOrder.name}</p>

            <div className="form-group">
              <label>Vendor ID / Name</label>
              <input
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="e.g. vendor-001"
              />
            </div>

            <div className="modal-actions vertical">
              <button
                className="primary-btn"
                onClick={submitAndAssign}
              >
                Submit & Assign
              </button>

              <button
                className="modal-close"
                onClick={() => setSubmittingOrder(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(showCreate || editingDraft) && (
        <CreateDraftModal
          existingDraft={editingDraft}
          onSave={saveDraft}
          onClose={() => {
            setShowCreate(false)
            setEditingDraft(null)
          }}
        />
      )}
    </>
  )
}

export default Orders
