import React, { useState } from 'react'

const RequestHistory = ({ requests }) => {
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Completed + Rejected only
  const historyRequests = requests.filter(
    (r) => r.status === 'Completed' || r.status === 'Rejected'
  )

  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  if (historyRequests.length === 0) {
    return <p>No request history available.</p>
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
          {historyRequests.map((r) => (
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

export default RequestHistory
