import React, { useEffect, useState } from "react"
import axios from "axios"
import BidDetailsModal from "./BidDetailsModal"

const ManagerAuctionDetailsModal = ({ auction, onClose }) => {
  const [bids, setBids] = useState([])
  const [selectedBid, setSelectedBid] = useState(null)

  useEffect(() => {
    loadBids()
  }, [])

  const loadBids = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auctions/${auction.id}/bids`
      )

      setBids(res.data)

    } catch (err) {
      console.error(err)
    }
  }

  const selectBid = async (bidId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/auctions/${auction.id}/select-bid/${bidId}`
      )

      alert("Bid selected. Order created.")
      onClose()

    } catch (err) {
      console.error(err)
      alert("Failed to select bid")
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-card modal-large"
          onClick={e => e.stopPropagation()}
        >
          <h2>{auction.name}</h2>

          <p><strong>Description:</strong> {auction.description}</p>
          <p><strong>Ends:</strong> {new Date(auction.endDate).toLocaleString()}</p>
          <p><strong>Delivery:</strong> {new Date(auction.deliveryDate).toLocaleDateString()}</p>

          <h3>Items</h3>
          <table className="cart-table">
            <tbody>
              {auction.items.map(i => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{i.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 24 }}>Bids</h3>

          {bids.length === 0 ? (
            <p>No bids submitted yet.</p>
          ) : (
            <table className="records-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Delivery</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bids.map(b => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBid(b)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{b.vendor.organizationName || b.vendor.name || b.vendor.email}</td>
                    <td>₹{b.amount}</td>
                    <td>{new Date(b.deliveryDate).toLocaleDateString()}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {selectedBid && (
        <BidDetailsModal
          bid={selectedBid}
          onClose={() => setSelectedBid(null)}
          onSelect={selectBid}
        />
      )}
    </>
  )
}

export default ManagerAuctionDetailsModal