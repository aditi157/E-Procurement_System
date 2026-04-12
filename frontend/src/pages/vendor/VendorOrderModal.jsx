import React from "react"

const VendorOrderModal = ({ order, onClose }) => {

  const total = order.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2>{order.name}</h2>

        <p><strong>Status:</strong> {order.status}</p>

        <h3>Items</h3>
        <table className="cart-table">
          <tbody>
            {order.items.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
                <td>₹{i.unitPrice * i.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="cart-total">Total: ₹{total}</p>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default VendorOrderModal