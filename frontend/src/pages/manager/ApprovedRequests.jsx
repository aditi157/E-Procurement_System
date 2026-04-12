import React, { useEffect, useState } from 'react'
import AddToOrderModal from './AddToOrderModal'
import AddToAuctionModal from "./AddToAuctionModal"
import axios from "axios"

const ApprovedRequests = ({ requests = [] }) => {
  const [selected, setSelected] = useState(null)
  const [showAddToOrder, setShowAddToOrder] = useState(false)
  const [showAuctionModal, setShowAuctionModal] = useState(false)
  const [orderNames, setOrderNames] = useState([])

  /* ---------- FIXED PRICE FIELD ---------- */
  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  /* ---------- FETCH ORDER USAGE ---------- */
  useEffect(() => {
    const fetchOrderUsage = async () => {
      if (!selected) return

      try {
        const res = await axios.get("http://localhost:5000/api/orders")

        const usedIn = res.data
          .filter(o =>
            o.requests?.some(r => r.id === selected.id)
          )
          .map(o => o.name)

        setOrderNames(usedIn)

      } catch (err) {
        console.error(err)
      }
    }

    fetchOrderUsage()
  }, [selected])

  return (
    <>
      <table className="records-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Approved Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr
              key={r.id}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(r)}
            >
              <td>{r.id}</td>
              <td>{r.requestedBy}</td>
              <td>
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MAIN MODAL */}
      {selected && !showAddToOrder && !showAuctionModal && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-card"
            onClick={e => e.stopPropagation()}
          >
            <h2>Approved Request</h2>

            {/* ORDER INFO */}
            {orderNames.length > 0 && (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #2563eb',
                  padding: 14,
                  borderRadius: 10,
                  marginBottom: 16
                }}
              >
                <strong>Already added to:</strong>
                <ul>
                  {orderNames.map(n => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ITEMS */}
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

            <p className="cart-total">
              Total: ₹{totalAmount(selected.items)}
            </p>

            {/* ACTIONS */}
            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={() => setShowAddToOrder(true)}
              >
                Add to Order Draft
              </button>

              <button
                className="primary-btn"
                onClick={() => setShowAuctionModal(true)}
              >
                Add to Auction
              </button>
            </div>

            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ORDER MODAL */}
      {showAddToOrder && selected && (
        <AddToOrderModal
          request={selected}
          onClose={() => {
            setShowAddToOrder(false)
            setSelected(null)
          }}
        />
      )}

      {/* AUCTION MODAL */}
      {showAuctionModal && selected && (
        <AddToAuctionModal
          request={selected}
          onClose={() => {
            setShowAuctionModal(false)
            setSelected(null)
          }}
        />
      )}
    </>
  )
}

export default ApprovedRequests