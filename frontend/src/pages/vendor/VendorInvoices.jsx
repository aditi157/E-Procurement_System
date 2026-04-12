import React, { useEffect, useState } from "react"
import axios from "axios"
import CreateInvoiceModal from "./CreateInvoiceModal"

const VendorInvoices = () => {
  const [invoices, setInvoices] = useState([])
  const [showModal, setShowModal] = useState(false)

  const loadInvoices = async () => {
  try {
    const token = localStorage.getItem("token")

    const res = await axios.get(
      "http://localhost:5000/api/vendor/invoices",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setInvoices(res.data)

  } catch (err) {
    console.error(err)
  }
}

  useEffect(() => {
    loadInvoices()
  }, [])

  const activeInvoices = invoices.filter(i =>
    i.status === "SUBMITTED" ||
    i.status === "APPROVED"
  )

  const historyInvoices = invoices.filter(i =>
    i.status === "PAID" ||
    i.status === "REJECTED"
  )

  return (
    <div className="section">
      <div className="top-actions">
        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + Create Invoice
        </button>
      </div>

      <h2>Created Invoices</h2>
      {activeInvoices.length === 0 ? (
        <p>No active invoices</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Order</th>
              <th>Total</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {activeInvoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.order.name}</td>
                <td>₹{inv.totalAmount}</td>
                <td>{inv.status}</td>
                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: 40 }}>Invoice History</h2>
      {historyInvoices.length === 0 ? (
        <p>No invoice history</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Order</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {historyInvoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.order.name}</td>
                <td>₹{inv.totalAmount}</td>
                <td>{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <CreateInvoiceModal
          onClose={() => {
            setShowModal(false)
            loadInvoices()
          }}
        />
      )}
    </div>
  )
}

export default VendorInvoices