import React, { useEffect, useState } from 'react'

const VENDOR_ID = 'vendor-001'

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [auctions, setAuctions] = useState([])

  useEffect(() => {
    const allOrders =
      JSON.parse(localStorage.getItem('manager_orders')) || []
    setOrders(allOrders.filter(o => o.vendorId === VENDOR_ID))

    const allAuctions =
      JSON.parse(localStorage.getItem('auctions')) || []
    setAuctions(allAuctions)
  }, [])

  const activeOrders = orders.filter(o => o.status !== 'Paid')
  const orderHistory = orders.filter(o => o.status === 'Paid')

  const invited = auctions.filter(
    a => a.invitedVendors?.includes(VENDOR_ID) && a.status === 'Open'
  )
  const open = auctions.filter(a => a.openToAll && a.status === 'Open')
  const ongoing = auctions.filter(
    a => a.bids?.some(b => b.vendorId === VENDOR_ID) && a.status === 'Open'
  )
  const history = auctions.filter(a => a.status === 'Closed')

  const AuctionCard = ({ auction }) => (
    <div className="catalog-card">
      <h3>{auction.title}</h3>
      <p>Status: {auction.status}</p>
      <button>View Auction</button>
    </div>
  )

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="sidebar-title">Vendor</h2>
        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            Orders
          </li>
          <li className={activeTab === 'orderHistory' ? 'active' : ''} onClick={() => setActiveTab('orderHistory')}>
            Order History
          </li>
          <li className={activeTab === 'auctions' ? 'active' : ''} onClick={() => setActiveTab('auctions')}>
            Auctions
          </li>
          <li className="logout">Logout</li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <h1>Vendor Dashboard</h1>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="section">
            <p><strong>Active Orders:</strong> {activeOrders.length}</p>
            <p><strong>Invited Auctions:</strong> {invited.length}</p>
            <p><strong>Open Auctions:</strong> {open.length}</p>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="section">
            <h2>Active Orders</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map(o => (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ORDER HISTORY */}
        {activeTab === 'orderHistory' && (
          <div className="section">
            <h2>Order History</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map(o => (
                  <tr key={o.id}>
                    <td>{o.name}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AUCTIONS */}
        {activeTab === 'auctions' && (
          <>
            <div className="section">
              <h2>Invitations</h2>
              <div className="catalog-grid">
                {invited.map(a => <AuctionCard key={a.id} auction={a} />)}
              </div>
            </div>

            <div className="section">
              <h2>Open Auctions</h2>
              <div className="catalog-grid">
                {open.map(a => <AuctionCard key={a.id} auction={a} />)}
              </div>
            </div>

            <div className="section">
              <h2>Ongoing Auctions</h2>
              <div className="catalog-grid">
                {ongoing.map(a => <AuctionCard key={a.id} auction={a} />)}
              </div>
            </div>

            <div className="section">
              <h2>Auction History</h2>
              <div className="catalog-grid">
                {history.map(a => <AuctionCard key={a.id} auction={a} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VendorDashboard
