// import React, { useState } from 'react'
// import { updateRequestStatus } from '../../services/requestService'

// const IncomingRequests = ({ requests, refresh }) => {
//   const [selected, setSelected] = useState(null)

//   const approve = (id) => {
//     updateRequestStatus(id, 'Approved')
//     setSelected(null)
//     refresh()
//   }

//   const reject = (id) => {
//     updateRequestStatus(id, 'Rejected')
//     setSelected(null)
//     refresh()
//   }

//   const totalAmount = (items) =>
//     items.reduce((sum, i) => sum + i.price * i.quantity, 0)

//   if (requests.length === 0) {
//     return <p>No incoming requests.</p>
//   }

//   return (
//     <>
//       <table className="records-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Employee Name</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Created</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map(r => (
//             <tr
//               key={r.id}
//               onClick={() => setSelected(r)}
//               style={{ cursor: 'pointer' }}
//             >
//               <td>{r.id}</td>
//               <td></td>
//               <td>{r.requestedBy}</td>
//               <td>{r.department}</td>
//               <td>{new Date(r.createdAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selected && (
//         <div
//           className="modal-overlay"
//           onClick={() => setSelected(null)}
//         >
//           <div
//             className="modal-card"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>Request Details</h2>

//             <p><strong>ID:</strong> {selected.id}</p>
//             <p><strong>Email:</strong> {selected.requestedBy}</p>
//             <p><strong>Status:</strong> {selected.status}</p>

//             <h3 style={{ marginTop: 16 }}>Items</h3>
//             <table className="cart-table">
//               <thead>
//                 <tr>
//                   <th>Item</th>
//                   <th>Qty</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selected.items.map(i => (
//                   <tr key={i.id}>
//                     <td>{i.name}</td>
//                     <td>{i.quantity}</td>
//                     <td>₹{i.price * i.quantity}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <p className="cart-total">
//               Total: ₹{totalAmount(selected.items)}
//             </p>

//             <button onClick={() => approve(selected.id)}>
//               Approve
//             </button>

//             <button
//               style={{ marginTop: 8, background: '#dc2626' }}
//               onClick={() => reject(selected.id)}
//             >
//               Reject
//             </button>

//             <button
//               className="modal-close"
//               onClick={() => setSelected(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default IncomingRequests
import React, { useEffect, useState } from 'react'
import { getAllRequests } from '../../services/requestService'

const IncomingRequests = () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const submitted = getAllRequests().filter(
      r => r.status === 'Submitted'
    )
    setRequests(submitted)
  }, [])

  return (
    <div className="section">
      <h2>Incoming Requests</h2>

      {requests.length === 0 ? (
        <p>No incoming requests.</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>Chhavi Sindhu</td>
                <td>Procurement Department</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default IncomingRequests
