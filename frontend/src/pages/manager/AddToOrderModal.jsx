import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'manager_orders'

const AddToOrderModal = ({ request, onClose }) => {
  const [allOrders, setAllOrders] = useState([])
  const [draftOrders, setDraftOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [mode, setMode] = useState('existing') // existing | new
  const [alreadyAdded, setAlreadyAdded] = useState(false)
  const [forceAdd, setForceAdd] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  /* ---------- LOAD ORDERS ---------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    setAllOrders(stored)

    const drafts = stored.filter(o => o.status === 'Draft')
    setDraftOrders(drafts)

    const found = stored.some(
      o => Array.isArray(o.sourceRequests) && o.sourceRequests.includes(request.id)
    )
    setAlreadyAdded(found)

    if (drafts.length === 0) {
      setMode('new')
    }
  }, [request.id])

  /* ---------- HELPERS ---------- */
  const mergeItems = (existing = [], incoming = []) => {
    const merged = [...existing]

    incoming.forEach(item => {
      const found = merged.find(i => i.name === item.name)
      if (found) {
        found.quantity += item.quantity
      } else {
        merged.push({ ...item })
      }
    })

    return merged
  }

  const generateUniqueOrderName = () => {
    const ts = Date.now()
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `Order-${ts}-${rand}`
  }

  /* ---------- ACTIONS ---------- */
  const addToExistingOrder = () => {
    if (!selectedOrderId) return

    const updated = allOrders.map(order => {
      if (order.id !== selectedOrderId) return order

      return {
        ...order,
        items: mergeItems(order.items, request.items),
        sourceRequests: Array.isArray(order.sourceRequests)
          ? order.sourceRequests.includes(request.id)
            ? order.sourceRequests
            : [...order.sourceRequests, request.id]
          : [request.id]
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSuccessMsg('Request added to selected order draft.')
  }

  const createNewOrder = () => {
    const newOrder = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: generateUniqueOrderName(),
      status: 'Draft',
      createdAt: new Date().toISOString(),
      items: request.items.map(i => ({ ...i })),
      sourceRequests: [request.id]
    }

    const updated = [...allOrders, newOrder]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSuccessMsg('Request added to new order draft.')
  }

  /* ---------- UI ---------- */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add Request to Order</h2>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div
            style={{
              background: '#ecfeff',
              border: '1px solid #22d3ee',
              padding: 16,
              borderRadius: 10,
              marginBottom: 20,
              color: '#0f172a'
            }}
          >
            <p style={{ marginBottom: 12 }}>{successMsg}</p>
            <button className="primary-btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}

        {!successMsg && alreadyAdded && !forceAdd && (
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #2563eb',
              padding: 16,
              borderRadius: 10,
              marginBottom: 20,
              color: '#1e40af'
            }}
          >
            <p style={{ marginBottom: 10 }}>
              This request has already been added to an order.
            </p>
            <button
              className="primary-btn"
              onClick={() => setForceAdd(true)}
            >
              Add to another order
            </button>
          </div>
        )}

        {!successMsg && (!alreadyAdded || forceAdd) && (
          <>
            <div className="form-group">
              <label>Choose action</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="existing">Add to existing draft</option>
                <option value="new">Create new draft order</option>
              </select>
            </div>

            {mode === 'existing' && (
              <table className="records-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Order</th>
                    <th>Created</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {draftOrders.map(o => (
                    <tr key={o.id}>
                      <td>
                        <input
                          type="radio"
                          name="order"
                          checked={selectedOrderId === o.id}
                          onChange={() => setSelectedOrderId(o.id)}
                        />
                      </td>
                      <td>{o.name}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>{o.items.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-actions vertical">
              {mode === 'existing' ? (
                <button className="primary-btn" onClick={addToExistingOrder}>
                  Add to Selected Order
                </button>
              ) : (
                <button className="primary-btn" onClick={createNewOrder}>
                  Create New Draft Order
                </button>
              )}

              <button className="modal-close" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AddToOrderModal
