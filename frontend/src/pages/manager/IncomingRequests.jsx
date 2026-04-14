import React, { useState } from 'react'

const IncomingRequests = ({ requests, onApprove, onReject }) => {
  const [selected, setSelected] = useState(null)

  const totalAmount = (items) =>
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <>
      <div className="section">
        {requests.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📥</span>
            <strong>No incoming requests</strong>
            New purchase requests from employees will appear here.
          </div>
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
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
                  <td>{r.id}</td>
                  <td>{r.requestedBy}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="primary-btn btn-success" style={{ marginRight: 8 }} onClick={() => onApprove(r.id)}>
                      Approve
                    </button>
                    <button className="primary-btn btn-danger" onClick={() => onReject(r.id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Request Details</h2>
            <p><strong>ID:</strong> {selected.id}</p>
            <p><strong>Employee:</strong> {selected.requestedBy}</p>
            <p><strong>Submitted:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
            <h3>Items</h3>
            <table className="cart-table">
              <tbody>
                {selected.items.map(i => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>× {i.quantity}</td>
                    <td>₹{(i.price * i.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="cart-total">Total: ₹{totalAmount(selected.items).toLocaleString('en-IN')}</p>
            <div className="modal-actions">
              <button className="primary-btn btn-success" onClick={() => { onApprove(selected.id); setSelected(null) }}>
                Approve
              </button>
              <button className="primary-btn btn-danger" onClick={() => { onReject(selected.id); setSelected(null) }}>
                Reject
              </button>
            </div>
            <button className="modal-close" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}

export default IncomingRequests