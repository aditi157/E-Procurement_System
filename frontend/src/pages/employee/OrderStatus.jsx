import React, { useState } from 'react'

const OrderStatus = ({ openRequests }) => {
  const [selectedRequest, setSelectedRequest] = useState(null)

  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  if (openRequests.length === 0) {
    return <p>No active requests.</p>
  }

  return (
    <>
      <table className="records-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {openRequests.map((r) => (
            <tr
              key={r.id}
              onClick={() => setSelectedRequest(r)}
              style={{ cursor: 'pointer' }}
            >
              <td>{r.id}</td>
              <td>{r.status}</td>
              <td>
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Request Details</h2>

            <p><strong>ID:</strong> {selectedRequest.id}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p>
              <strong>Created:</strong>{' '}
              {new Date(
                selectedRequest.createdAt
              ).toLocaleString()}
            </p>

            <h3 style={{ marginTop: '16px' }}>Items</h3>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>₹{i.price * i.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="cart-total">
              Total: ₹{totalAmount(selectedRequest.items)}
            </p>

            <button
              className="modal-close"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderStatus
