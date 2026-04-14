import React from 'react'
import axios from 'axios'

const FinanceInvoiceModal = ({ invoice, onClose, onApproved, onRejected }) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const approve = async () => {
    await axios.post(
      `http://localhost:5000/api/finance/invoice/${invoice.id}/approve`,
      { financeId: user.id },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    onApproved?.()
    onClose()
  }

  const reject = async () => {
    await axios.post(
      `http://localhost:5000/api/finance/invoice/${invoice.id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    onRejected?.()
    onClose()
  }

  const order = invoice.vendorOrder.order
  const orderTotal = order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const diff = invoice.totalAmount - orderTotal
  const hasDiff = diff !== 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <h2>Invoice Review</h2>

        <p><strong>Invoice #:</strong>  {invoice.invoiceNumber}</p>
        <p><strong>Vendor:</strong>     {invoice.vendorOrder.vendor?.name}</p>
        <p><strong>Invoice Total:</strong> ₹{invoice.totalAmount?.toLocaleString('en-IN')}</p>
        <p><strong>Order Total:</strong>   ₹{orderTotal?.toLocaleString('en-IN')}</p>

        {hasDiff && (
          <div className="info-box" style={{ borderLeftColor: 'var(--rose)' }}>
            ⚠ Amount mismatch — difference of{' '}
            <strong className="diff-negative">₹{Math.abs(diff).toLocaleString('en-IN')}</strong>
          </div>
        )}

        <h3>Items</h3>
        <table className="cart-table">
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Total</th></tr>
          </thead>
          <tbody>
            {order.items.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>₹{(i.unitPrice * i.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoice.status === 'SUBMITTED' && (
          <div className="modal-actions">
            <button className="primary-btn btn-success" onClick={approve}>
              Approve Payment
            </button>
            <button className="primary-btn btn-danger" onClick={reject}>
              Reject Invoice
            </button>
          </div>
        )}

        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default FinanceInvoiceModal