// import React, { useEffect, useState } from 'react'
// import AddToOrderModal from './AddToOrderModal'

// const STORAGE_KEY = 'manager_orders'

// const ApprovedRequests = ({ requests, onAddToAuction }) => {
//   const [selected, setSelected] = useState(null)
//   const [showAddToOrder, setShowAddToOrder] = useState(false)
//   const [orderNames, setOrderNames] = useState([])

//   useEffect(() => {
//     if (!selected) return

//     const orders =
//       JSON.parse(localStorage.getItem(STORAGE_KEY)) || []

//     const usedIn = orders
//       .filter(o =>
//         Array.isArray(o.sourceRequests) &&
//         o.sourceRequests.includes(selected.id)
//       )
//       .map(o => o.name)

//     setOrderNames(usedIn)
//   }, [selected])

//   if (!requests || requests.length === 0) {
//     return <p>No approved requests.</p>
//   }

//   return (
//     <>
//       <table className="records-table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Employee</th>
//             <th>Approved</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map(r => (
//             <tr
//               key={r.id}
//               style={{ cursor: 'pointer' }}
//               onClick={() => setSelected(r)}
//             >
//               <td>{r.id}</td>
//               <td>{r.requestedBy}</td>
//               <td>{new Date(r.createdAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {selected && !showAddToOrder && (
//         <div className="modal-overlay" onClick={() => setSelected(null)}>
//           <div className="modal-card" onClick={e => e.stopPropagation()}>
//             <h2>Approved Request</h2>

//             <p><strong>ID:</strong> {selected.id}</p>
//             <p><strong>Employee:</strong> {selected.requestedBy}</p>

//             {orderNames.length > 0 && (
//               <div
//                 style={{
//                   background: '#eff6ff',
//                   border: '1px solid #2563eb',
//                   padding: 14,
//                   borderRadius: 10,
//                   marginTop: 16,
//                   color: '#1e40af'
//                 }}
//               >
//                 <strong>Already added to:</strong>
//                 <ul style={{ marginTop: 8 }}>
//                   {orderNames.map(name => (
//                     <li key={name}>{name}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div className="modal-actions" style={{ marginTop: 20 }}>
//               <button
//                 className="primary-btn"
//                 onClick={() => setShowAddToOrder(true)}
//               >
//                 Add to Order Draft
//               </button>

//               <button
//                 className="primary-btn"
//                 onClick={() => {
//                   onAddToAuction(selected)
//                   setSelected(null)
//                 }}
//               >
//                 Add to Auction
//               </button>
//             </div>

//             <button
//               className="modal-close"
//               onClick={() => setSelected(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {showAddToOrder && selected && (
//         <AddToOrderModal
//           request={selected}
//           onClose={() => {
//             setShowAddToOrder(false)
//             setSelected(null)
//           }}
//         />
//       )}
//     </>
//   )
// }

// export default ApprovedRequests


import React, { useEffect, useState } from 'react'
import AddToOrderModal from './AddToOrderModal'
import fakeUsers from '../../data/fakeUsers'

const STORAGE_KEY = 'manager_orders'

const ApprovedRequests = ({ requests = [], onAddToAuction }) => {
  const [selected, setSelected] = useState(null)
  const [showAddToOrder, setShowAddToOrder] = useState(false)
  const [orderNames, setOrderNames] = useState([])

  const getEmployeeInfo = (email) => {
    const user = fakeUsers.find(
      u => u.email === email && u.role === 'Employee'
    )
    return {
      name: user?.organizationName || 'Unknown',
      department: user?.location || 'N/A'
    }
  }

  useEffect(() => {
    if (!selected) return

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []

    const usedIn = orders
      .filter(o => o.sourceRequests?.includes(selected.id))
      .map(o => o.name)

    setOrderNames(usedIn)
  }, [selected])

  if (requests.length === 0) {
    return <p>No approved requests.</p>
  }

  return (
    <>
      <table className="records-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Approved Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => {
            const emp = getEmployeeInfo(r.requestedBy)

            return (
              <tr
                key={r.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelected(r)}
              >
                <td>{r.id}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* REQUEST DETAILS MODAL */}
      {selected && !showAddToOrder && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Approved Request</h2>

            {orderNames.length > 0 && (
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #2563eb',
                  padding: 14,
                  borderRadius: 10,
                  marginBottom: 16
                }}
              >
                <strong>Already added to:</strong>
                <ul>
                  {orderNames.map(n => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={() => setShowAddToOrder(true)}
              >
                Add to Order Draft
              </button>

              <button
                className="primary-btn"
                onClick={() => {
                  onAddToAuction(selected)
                  setSelected(null)
                }}
              >
                Add to Auction
              </button>
            </div>

            <button className="modal-close" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ADD TO ORDER MODAL */}
      {showAddToOrder && selected && (
        <AddToOrderModal
          request={selected}
          onClose={() => {
            setShowAddToOrder(false)
            setSelected(null)
          }}
        />
      )}
    </>
  )
}

export default ApprovedRequests
