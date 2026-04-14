import React, { useEffect, useState } from 'react'
import AddToOrderModal from './AddToOrderModal'
import AddToAuctionModal from './AddToAuctionModal'
import axios from 'axios'

const ApprovedRequests = ({ requests = [] }) => {
  const [selected, setSelected]             = useState(null)
  const [showAddToOrder, setShowAddToOrder] = useState(false)
  const [showAuctionModal, setShowAuctionModal] = useState(false)
  const [orderNames, setOrderNames]         = useState([])

  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  useEffect(() => {
    const fetchOrderUsage = async () => {
      if (!selected) return
      try {
        const res = await axios.get('http://localhost:5000/api/orders')
        const usedIn = res.data
          .filter(o => o.requests?.some(r => r.id === selected.id))
          .map(o => o.name)
        setOrderNames(usedIn)
      } catch (err) { console.error(err) }
    }
    fetchOrderUsage()
  }, [selected])

  return (
    <>
      {requests.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">✅</span>
          <strong>No approved requests</strong>
          Approved requests from employees will appear here.
        </div>
      ) : (
        <table className="records-table">
          <thead>
            <tr><th>ID</th><th>Employee</th><th>Approved Date</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
                <td>{r.id}</td>
                <td>{r.requestedBy}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && !showAddToOrder && !showAuctionModal && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Approved Request</h2>

            {orderNames.length > 0 && (
              <div className="info-box">
                <strong>Already added to:</strong>
                <ul>{orderNames.map(n => <li key={n}>{n}</li>)}</ul>
              </div>
            )}

            <h3>Items</h3>
            <table className="cart-table">
              <tbody>
                {selected.items.map(i => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>₹{i.price * i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cart-total">Total: ₹{totalAmount(selected.items).toLocaleString('en-IN')}</p>

            <div className="modal-actions">
              <button className="primary-btn" onClick={() => setShowAddToOrder(true)}>
                Add to Order Draft
              </button>
              <button className="primary-btn" onClick={() => setShowAuctionModal(true)}>
                Add to Auction
              </button>
            </div>
            <button className="modal-close" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {showAddToOrder && selected && (
        <AddToOrderModal
          request={selected}
          onClose={() => { setShowAddToOrder(false); setSelected(null) }}
        />
      )}

      {showAuctionModal && selected && (
        <AddToAuctionModal
          request={selected}
          onClose={() => { setShowAuctionModal(false); setSelected(null) }}
        />
      )}
    </>
  )
}

export default ApprovedRequests