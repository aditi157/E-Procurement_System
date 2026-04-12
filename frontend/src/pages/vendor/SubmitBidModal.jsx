import React, { useState } from "react"
import axios from "axios"

const SubmitBidModal = ({ auction, onClose }) => {
  const user = JSON.parse(localStorage.getItem("user"))

  const [amount, setAmount] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [notes, setNotes] = useState("")

  const submitBid = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/auctions/${auction.id}/bid`,
        {
          vendorId: user.id,
          amount,
          deliveryDate,
          notes
        }
      )

      alert("Bid submitted")
      onClose(true)

    } catch (err) {
      console.error(err)
      alert("Failed to submit bid")
    }
  }

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
      >
        <h2>Submit Bid</h2>

        <div className="form-group">
          <label>Bid Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Delivery Date</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Notes / Terms</label>
          <textarea
            rows="4"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="primary-btn" onClick={submitBid}>
            Submit Bid
          </button>

          <button
            className="modal-close"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitBidModal