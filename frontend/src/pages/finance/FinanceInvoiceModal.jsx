import React from "react"
import axios from "axios"

const FinanceInvoiceModal = ({ invoice, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"))

  const approve = async () => {
    await axios.post(
  `http://localhost:5000/api/finance/invoice/${invoice.id}/approve`,
  {
    financeId: user.id
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
)

    onClose()
  }

  const reject = async () => {
    await axios.post(
  `http://localhost:5000/api/finance/invoice/${invoice.id}/reject`,
  {},
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
)
    onClose()
  }

  const order = invoice.vendorOrder.order

  const orderTotal = order.items.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <h2>Invoice Review</h2>

        <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Vendor:</strong> {invoice.vendorOrder.vendor?.name}</p>

        <p><strong>Invoice Total:</strong> ₹{invoice.totalAmount}</p>
        <p><strong>Order Total:</strong> ₹{orderTotal}</p>

        <p>
          <strong>Difference:</strong>{" "}
          <span style={{
            color: invoice.totalAmount !== orderTotal ? "red" : "green"
          }}>
            ₹{invoice.totalAmount - orderTotal}
          </span>
        </p>

        <h3>Items</h3>
        <table className="cart-table">
          <tbody>
            {order.items.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>₹{i.unitPrice * i.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>


        {invoice.status === "SUBMITTED" && (
  <div className="modal-actions">
    <button className="primary-btn" onClick={approve}>
      Approve Payment
    </button>

    <button className="primary-btn" onClick={reject}>
      Reject Invoice
    </button>
  </div>
)}
      </div>
    </div>
  )
}

export default FinanceInvoiceModal