import React from "react"

const BidDetailsModal = ({ bid, onClose, onSelect }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2>Bid Details</h2>

        <p><strong>Vendor:</strong> {bid.vendor.orgName || bid.vendor.name}</p>
        <p><strong>Amount:</strong> ₹{bid.amount}</p>
        <p><strong>Delivery:</strong> {new Date(bid.deliveryDate).toLocaleDateString()}</p>

        <p><strong>Notes:</strong></p>
        <p>{bid.notes || "No notes provided."}</p>

        <div className="modal-actions">
          <button className="primary-btn" onClick={() => onSelect(bid.id)}>
            Select Bid
          </button>

          <button className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default BidDetailsModal