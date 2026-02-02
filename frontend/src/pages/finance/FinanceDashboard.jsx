import React, { useEffect, useState } from 'react'

const DEMO_INVOICES = [
  {
    id: 'INV-001',
    orderId: 'ORD-002',
    vendorId: 'vendor-001',
    amount: 300000,
    status: 'Pending'
  },
  {
    id: 'INV-002',
    orderId: 'ORD-003',
    vendorId: 'vendor-001',
    amount: 70000,
    status: 'Paid'
  }
]

const FinanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem('invoices'))

    // ✅ DEMO SAFETY NET
    if (!stored || stored.length === 0) {
      localStorage.setItem('invoices', JSON.stringify(DEMO_INVOICES))
      stored = DEMO_INVOICES
    }

    setInvoices(stored)
  }, [])

  const pending = invoices.filter(i => i.status !== 'Paid')
  const paid = invoices.filter(i => i.status === 'Paid')

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="sidebar-title">Finance</h2>
        <ul className="sidebar-menu">
          <li
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={activeTab === 'invoices' ? 'active' : ''}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </li>
          <li
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Invoice History
          </li>
          <li className="logout">Logout</li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <h1>Finance Dashboard</h1>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="section">
            <p><strong>Total Invoices:</strong> {invoices.length}</p>
            <p><strong>Pending:</strong> {pending.length}</p>
            <p><strong>Paid:</strong> {paid.length}</p>
            <p>
              <strong>Total Pending Amount:</strong> ₹
              {pending.reduce((sum, i) => sum + i.amount, 0)}
            </p>
          </div>
        )}

        {/* INVOICES */}
        {activeTab === 'invoices' && (
          <div className="section">
            <h2>Invoices</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Order</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(i => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.orderId}</td>
                    <td>{i.vendorId}</td>
                    <td>₹{i.amount}</td>
                    <td>{i.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="section">
            <h2>Invoice History</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Order</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {paid.map(i => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.orderId}</td>
                    <td>₹{i.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FinanceDashboard
