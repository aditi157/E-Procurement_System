import React, { useEffect, useState } from "react"
import axios from "axios"
import SubmitBidModal from "./SubmitBidModal"

const VendorAuctionModal = ({ auction, onClose }) => {
  const [showBidModal, setShowBidModal] = useState(false)
  const [myBid, setMyBid] = useState(null)

  useEffect(() => {
    loadMyBid()
  }, [])

  const loadMyBid = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"))

      const res = await axios.get(
        `http://localhost:5000/api/auctions/${auction.id}/bids`
      )

      const mine = res.data.find(
        b => b.vendorId === user.id
      )

      setMyBid(mine || null)

    } catch (err) {
      console.error(err)
    }
  }

  const isClosed =
    auction.status === "COMPLETED" ||
    auction.status === "SELECTED" ||
    new Date(auction.endDate) <= new Date()

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-card modal-large"
          onClick={e => e.stopPropagation()}
        >
          <h2>{auction.name}</h2>

          <p>
            <strong>Organization:</strong>{" "}
            {auction.manager?.orgName || "-"}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {auction.description}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {isClosed ? "Closed" : "Open"}
          </p>

          <p>
            <strong>Closes:</strong>{" "}
            {new Date(auction.endDate).toLocaleString()}
          </p>

          <p>
            <strong>Expected Delivery:</strong>{" "}
            {new Date(auction.deliveryDate).toLocaleDateString()}
          </p>

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

          {myBid && (
            <div className="success-box" style={{ marginTop: 20 }}>
              <h4>Your Bid</h4>
              <p><strong>Amount:</strong> ₹{myBid.amount}</p>
              <p>
                <strong>Delivery:</strong>{" "}
                {new Date(myBid.deliveryDate).toLocaleDateString()}
              </p>
              <p><strong>Status:</strong> {myBid.status}</p>
            </div>
          )}

          <div className="modal-actions">
            {!myBid && !isClosed && (
              <button
                className="primary-btn"
                onClick={() => setShowBidModal(true)}
              >
                Submit Bid
              </button>
            )}

            <button
              className="modal-close"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {showBidModal && (
        <SubmitBidModal
          auction={auction}
          onClose={(submitted) => {
            setShowBidModal(false)

            if (submitted) {
              loadMyBid()
            }
          }}
        />
      )}
    </>
  )
}

export default VendorAuctionModal