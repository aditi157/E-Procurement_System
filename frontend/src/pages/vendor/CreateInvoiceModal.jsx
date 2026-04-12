import React, { useEffect, useState } from "react"
import axios from "axios"

const CreateInvoiceModal = ({ onClose }) => {
  const [orders, setOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")

  
  useEffect(() => {
    loadOrders()
  }, [])

//   const loadOrders = async () => {
//     const res = await axios.get(
//       "http://localhost:5000/api/vendor/invoice-eligible-orders"
//     )

//     setOrders(res.data)
//   }

const loadOrders = async () => {
  try {
    const token = localStorage.getItem("token")

    const res = await axios.get(
      "http://localhost:5000/api/vendor/invoice-eligible-orders",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setOrders(res.data)

  } catch (err) {
    console.error("LOAD ELIGIBLE ORDERS ERROR:", err)
  }
}

  const submitInvoice = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/vendor/orders/${selectedOrderId}/invoice`,
        {
          invoiceNumber,
          dueDate,
          notes
        }
      )

      alert("Invoice created")
      onClose()

    } catch (err) {
      console.error(err)
      alert("Failed")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={e => e.stopPropagation()}
      >
        <h2>Create Invoice</h2>

        <div className="form-group">
          <label>Select Delivered Order</label>
          <select
            value={selectedOrderId}
            onChange={e => setSelectedOrderId(e.target.value)}
          >
            <option value="">Choose Order</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Invoice Number</label>
          <input
            value={invoiceNumber}
            onChange={e => setInvoiceNumber(e.target.value)}
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
            rows="4"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="primary-btn" onClick={submitInvoice}>
            Submit Invoice
          </button>

          <button className="modal-close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateInvoiceModal