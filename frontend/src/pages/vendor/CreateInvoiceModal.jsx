import React, { useEffect, useState } from "react"
import axios from "axios"

const CreateInvoiceModal = ({ onClose, onCreated }) => {
  const [orders, setOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(
        "http://localhost:5000/api/vendor/invoice-eligible-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(res.data)
    } catch (err) {
      console.error("LOAD ELIGIBLE ORDERS ERROR:", err)
      setError("Could not load eligible orders.")
    }
  }

  const submitInvoice = async () => {
    if (!selectedOrderId) { setError("Please select an order."); return }
    if (!invoiceNumber)   { setError("Please enter an invoice number."); return }

    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

await axios.post(
  `http://localhost:5000/api/vendor/orders/${selectedOrderId}/invoice`,
  { invoiceNumber, dueDate, notes },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
      onCreated?.()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || "Failed to submit invoice.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <h2>Create Invoice</h2>

        {orders.length === 0 && (
          <div className="info-box">
            No delivered orders are available for invoicing yet.
          </div>
        )}

        <div className="form-group">
          <label>Select Delivered Order</label>
          <select
            value={selectedOrderId}
            onChange={e => setSelectedOrderId(e.target.value)}
          >
            <option value="">Choose Order</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Invoice Number</label>
          <input
            value={invoiceNumber}
            onChange={e => setInvoiceNumber(e.target.value)}
            placeholder="e.g. INV-2024-001"
          />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Notes / Terms</label>
          <textarea
            rows="3"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Optional payment terms or notes"
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="modal-actions">
          <button
            className="primary-btn btn-success"
            onClick={submitInvoice}
            disabled={loading}
          >
            {loading ? "Submitting…" : "Submit Invoice"}
          </button>
          <button className="modal-close" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default CreateInvoiceModal