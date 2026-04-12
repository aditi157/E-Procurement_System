import React, { useState } from 'react'

const IncomingRequests = ({ requests, onApprove, onReject }) => {
  const [selected, setSelected] = useState(null)

  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <>
      <div className="section">
        <h2>Incoming Requests</h2>

        {requests.length === 0 ? (
          <p>No incoming requests.</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Employee</th>
                <th>Submitted On</th>
                <th>Actions</th>
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
                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onApprove(r.id)}>
                      Approve
                    </button><pre> </pre>
                    <button onClick={() => onReject(r.id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 MODAL */}
      {selected && (
        <div
          className="modal-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Request Details</h2>

            <p><strong>ID:</strong> {selected.id}</p>
            <p><strong>Employee:</strong> {selected.requestedBy}</p>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(selected.createdAt).toLocaleString()}
            </p>

            <h3 style={{ marginTop: '16px' }}>Items</h3>
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

            <div className="modal-actions">
              <button className="primary-btn" onClick={() => onApprove(selected.id)}>
                Approve
              </button>
              <button className="primary-btn" onClick={() => onReject(selected.id)}>
                Reject
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
    </>
  )
}

export default IncomingRequests