import React, { useEffect, useState } from 'react'
import axios from 'axios'
import FinanceSidebar from './FinanceSidebar'
import FinanceInvoiceModal from './FinanceInvoiceModal'
import { useToast } from '../../context/ToastContext'

const statusClass = (s = '') => {
  const map = {
    PAID: 'badge-paid', SUBMITTED: 'badge-submitted',
    PENDING: 'badge-pending', REJECTED: 'badge-rejected',
  }
  return map[s] || 'badge-draft'
}

const FinanceDashboard = () => {
  const toast = useToast()
  const [activeMenu, setActiveMenu]         = useState('dashboard')
  const [invoices, setInvoices]             = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const user = JSON.parse(localStorage.getItem('user'))

  const loadInvoices = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/finance/invoices', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInvoices(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { loadInvoices() }, [])

  const pending = invoices.filter(i => i.status === 'SUBMITTED' || i.status === 'PENDING')
  const history = invoices.filter(i => i.status === 'PAID' || i.status === 'REJECTED')

  const renderTable = (list) => (
    <table className="records-table">
      <thead>
        <tr>
          <th>Invoice #</th><th>Vendor</th><th>Order</th><th>Amount</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {list.map(i => (
          <tr key={i.id} onClick={() => setSelectedInvoice(i)} style={{ cursor: 'pointer' }}>
            <td>{i.invoiceNumber}</td>
            <td>{i.vendorOrder.vendor?.name}</td>
            <td>{i.vendorOrder.order.name}</td>
            <td>₹{i.totalAmount?.toLocaleString('en-IN')}</td>
            <td><span className={`badge ${statusClass(i.status)}`}>{i.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const getPageTitle = () =>
    ({ invoices: 'Invoices', profile: 'Profile' }[activeMenu] || 'Finance Dashboard')

  return (
    <div className="dashboard-layout">
      <FinanceSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="dashboard-content">
        <h1 className="title">{getPageTitle()}</h1>
        <p className="subtitle">Logged in as <strong>{user?.email}</strong></p>

        {(activeMenu === 'dashboard' || activeMenu === 'invoices') && (
          <>
            <div className="stat-row">
              <div className="stat-card">
                <div className="stat-label">Total Invoices</div>
                <div className="stat-value">{invoices.length}</div>
              </div>
              <div className="stat-card stat-amber">
                <div className="stat-label">Pending Review</div>
                <div className="stat-value">{pending.length}</div>
              </div>
              <div className="stat-card stat-teal">
                <div className="stat-label">Processed</div>
                <div className="stat-value">{history.length}</div>
              </div>
              <div className="stat-card stat-rose">
                <div className="stat-label">Total Paid</div>
                <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                  ₹{history
                    .filter(i => i.status === 'PAID')
                    .reduce((sum, i) => sum + (i.totalAmount || 0), 0)
                    .toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <h2>Pending Invoice Review</h2>
            {pending.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">✅</span>
                <strong>All caught up!</strong>
                No invoices pending review.
              </div>
            ) : renderTable(pending)}

            <h2 style={{ marginTop: 40 }}>Invoice History</h2>
            {history.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🗂️</span>
                <strong>No history yet</strong>
                Paid and rejected invoices will appear here.
              </div>
            ) : renderTable(history)}
          </>
        )}

        {activeMenu === 'profile' && (
          <div className="profile-card">
            <h2>{user?.name}</h2>
            <p><strong>Email:</strong>        {user?.email}</p>
            <p><strong>Role:</strong>         {user?.role}</p>
            <p><strong>Organization:</strong> {user?.orgName || 'N/A'}</p>
            <p><strong>Invoices Processed:</strong> {history.length}</p>
            {user?.createdAt && (
              <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>

      {selectedInvoice && (
        <FinanceInvoiceModal
          invoice={selectedInvoice}
          onClose={() => { setSelectedInvoice(null); loadInvoices() }}
          onApproved={() => toast('Invoice approved & payment processed', 'success')}
          onRejected={() => toast('Invoice rejected', 'error')}
        />
      )}
    </div>
  )
}

export default FinanceDashboard