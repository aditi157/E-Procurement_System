// import React from "react"
// import axios from "axios"


//  const cancelOrder = async (order) => {
//   try {
//     await axios.post(
//       `http://localhost:5000/api/orders/${order.id}/cancel`
//     )

//     loadOrders()
//     setSelectedOrder(null)

//   } catch (err) {
//     console.error(err)
//     alert("Failed to cancel order")
//   }
// }



// const OrderDetailsModal = ({ order, onClose, onAssign, onCancel }) => {

//   const total = order.items.reduce(
//     (sum, i) => sum + i.unitPrice * i.quantity,
//     0
//   )


 


//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div
//         className="modal-card"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2>Order Details</h2>

//         <p><strong>Name:</strong> {order.name}</p>
//         <p><strong>Status:</strong> {order.status}</p>
//         <p><strong>Vendor:</strong> {order.vendor || "-"}</p>
//         <h3>Items</h3>
//         <table className="cart-table">
//           <tbody>
//             {order.items.map(i => (
//               <tr key={i.id}>
//                 <td>{i.name}</td>
//                 <td>{i.quantity}</td>
//                 <td>₹{i.unitPrice * i.quantity}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <p className="cart-total">Total: ₹{total}</p>

//         {/* ACTIONS */}
//         {order.status === "draft" && (
//           <button onClick={() => onAssign(order)}>
//             Submit & Assign Vendor
//           </button>
//         )}

//         <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
//             <button className="modal-close" onClick={() => onCancel(order)}>
//                 Cancel Order
//             </button>
//             <button className="modal-close" onClick={onClose}>
//             Close
//             </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default OrderDetailsModal





import React from "react"

const OrderDetailsModal = ({
  order,
  onClose,
  onAssign,
  onCancel,
  onAccept,
  onReject,
  onDeliver
}) => {

  const total = order.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Order Details</h2>

        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Vendor:</strong> {order.vendor || "-"}</p>

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

        {/* ACTIONS */}
        <div className="modal-actions">

          {order.status === "draft" && (
            <button onClick={() => onAssign(order)}>
              Submit & Assign
            </button>
          )}

          {order.status === "submitted" && (
            <button onClick={() => onCancel(order)}>
              Cancel
            </button>
          )}

          {order.status === "accepted" && (
            <button className="primary-btn" onClick={() => onDeliver(order.id)}>
              Mark Delivered
            </button>
          )}

           <button className="modal-close" onClick={onClose}>
          Close
        </button>

        </div>

       

      </div>
    </div>
  )
}

export default OrderDetailsModal