import React, { useEffect, useState } from 'react'
import axios from "axios"

const AddToOrderModal = ({ request, onClose }) => {
  const [draftOrders, setDraftOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [mode, setMode] = useState('existing')
  const [successMsg, setSuccessMsg] = useState('')

  const user = JSON.parse(localStorage.getItem("user"))

  /* ---------- LOAD ORDERS FROM BACKEND ---------- */
  const loadOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders")

      const drafts = res.data.filter(o => o.status === "DRAFT")
      setDraftOrders(drafts)

      if (drafts.length === 0) {
        setMode("new")
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  /* ---------- CREATE NEW ORDER ---------- */
  const createNewOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders", {
        requestId: request.id,
        managerId: user.id
      })

      setSuccessMsg("Order draft created successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to create order")
    }
  }

  /* ---------- ADD TO EXISTING ORDER ---------- */
  const addToExistingOrder = async () => {
    if (!selectedOrderId) return

    try {
      await axios.post(
        `http://localhost:5000/api/orders/${selectedOrderId}/add`,
        {
          requestId: request.id
        }
      )

      setSuccessMsg("Added to existing order")
    } catch (err) {
      console.error(err)
      alert("Failed to add to order")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Add Request to Order</h2>

        {/* SUCCESS */}
        {successMsg && (
          <div className="success-box">
            <p>{successMsg}</p>
            <pre> </pre>
            <button class="primary-btn" onClick={onClose}>Close</button>
          </div>
        )}

        {!successMsg && (
          <>
            <div className="form-group">
              <label>Choose action</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="existing">Add to existing draft</option>
                <option value="new">Create new draft</option>
              </select>
            </div>

            {mode === 'existing' && (
              <table className="records-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Order</th>
                    <th>Created</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {draftOrders.map(o => (
                    <tr key={o.id}>
                      <td>
                        <input
                          type="radio"
                          checked={selectedOrderId === o.id}
                          onChange={() => setSelectedOrderId(o.id)}
                        />
                      </td>
                      <td>{o.name}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-actions">
              {mode === 'existing' ? (
                <button class="primary-btn" onClick={addToExistingOrder}>
                  Add to Selected Order
                </button>
              ) : (
                <button className="primary-btn" onClick={createNewOrder}>
                  Create New Order
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