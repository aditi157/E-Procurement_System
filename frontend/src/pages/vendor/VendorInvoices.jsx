import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CreateInvoiceModal from './CreateInvoiceModal'
import { useToast } from '../../context/ToastContext'

const statusClass = (s = '') => {
  const map = { SUBMITTED: 'badge-submitted', APPROVED: 'badge-approved', PAID: 'badge-paid', REJECTED: 'badge-rejected' }
  return map[s] || 'badge-draft'
}

const VendorInvoices = () => {
  const toast = useToast()
  const [invoices, setInvoices] = useState([])
  const [showModal, setShowModal] = useState(false)

  const loadInvoices = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/vendor/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInvoices(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { loadInvoices() }, [])

  const activeInvoices  = invoices.filter(i => i.status === 'SUBMITTED' || i.status === 'APPROVED')
  const historyInvoices = invoices.filter(i => i.status === 'PAID' || i.status === 'REJECTED')

  return (
    <div className="section">
      <div className="top-actions">
        <button className="cart-button" onClick={() => setShowModal(true)}>
          + Create Invoice
        </button>
      </div>

      <h2>Created Invoices</h2>
      {activeInvoices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🧾</span>
          <strong>No active invoices</strong>
          Create an invoice for a delivered order.
        </div>
      ) : (
        <table className="records-table">
          <thead>
            <tr><th>Invoice #</th><th>Order</th><th>Total</th><th>Status</th><th>Due Date</th></tr>
          </thead>
          <tbody>
            {activeInvoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.order.name}</td>
                <td>₹{inv.totalAmount?.toLocaleString('en-IN')}</td>
                <td><span className={`badge ${statusClass(inv.status)}`}>{inv.status}</span></td>
                <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: 40 }}>Invoice History</h2>
      {historyInvoices.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🗂️</span>
          <strong>No invoice history</strong>
        </div>
      ) : (
        <table className="records-table">
          <thead>
            <tr><th>Invoice #</th><th>Order</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {historyInvoices.map(inv => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.order.name}</td>
                <td>₹{inv.totalAmount?.toLocaleString('en-IN')}</td>
                <td><span className={`badge ${statusClass(inv.status)}`}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <CreateInvoiceModal
          onClose={() => { setShowModal(false); loadInvoices() }}
          onCreated={() => toast('Invoice submitted successfully', 'success')}
        />
      )}
    </div>
  )
}

export default VendorInvoices