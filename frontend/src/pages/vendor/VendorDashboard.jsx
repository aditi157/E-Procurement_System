import React, { useEffect, useState } from "react"
import axios from "axios"
import VendorSidebar from "./VendorSidebar"
import VendorOrderModal from "./VendorOrderModal"
import VendorAuctionModal from "./VendorAuctionModal"
import VendorInvoices from "./VendorInvoices"

const VendorDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard")
const [selectedOrder, setSelectedOrder] = useState(null)
const [selectedAuction, setSelectedAuction] = useState(null)
  const [orders, setOrders] = useState([])
  const [auctions, setAuctions] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  /* ---------- LOAD ORDERS ---------- */
  const loadOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vendor/orders/${user.id}`
      )

      setOrders(res.data)

    } catch (err) {
      console.error(err)
    }
  }

  /* ---------- LOAD AUCTIONS ---------- */
  const loadAuctions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/vendor/auctions/${user.id}`
      )

      setAuctions(res.data)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadOrders()
    loadAuctions()
  }, [])

  /* ---------- ACTIONS ---------- */

  const acceptOrder = async (orderId) => {
    await axios.post(`http://localhost:5000/api/vendor/orders/${orderId}/accept`)
    loadOrders()
  }

  const rejectOrder = async (orderId) => {
    await axios.post(`http://localhost:5000/api/vendor/orders/${orderId}/reject`)
    loadOrders()
  }

  const markDelivered = async (orderId) => {
    await axios.post(`http://localhost:5000/api/vendor/orders/${orderId}/deliver`)
    loadOrders()
  }

  /* ---------- FILTERS ---------- */
  const activeOrders = orders.filter(o =>
    ["SUBMITTED", "ACCEPTED"].includes(o.status)
  )

  const historyOrders = orders.filter(o =>
    ["REJECTED", "DELIVERED"].includes(o.status)
  )

  const activeAuctions = auctions.filter(
  a =>
    a.status !== "COMPLETED" &&
    a.status !== "SELECTED" &&
    a.status !== "REJECTED" &&
    new Date(a.endDate) > new Date()
)

const auctionHistory = auctions.filter(
  a =>
    a.status === "COMPLETED" ||
    a.status === "SELECTED" ||
    a.status === "REJECTED" ||
    new Date(a.endDate) <= new Date()
)

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <VendorSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* MAIN CONTENT */}
      <div className="dashboard-content">

        <h1 className="title">
          {activeMenu === "dashboard"
            ? "Vendor Dashboard"
            : activeMenu === "orders"
            ? "Orders"
            : activeMenu === "auctions"
            ? "Auctions"
            : activeMenu === "invoices"
            ? "Invoices"  
            : "Profile"}
        </h1>

        <p className="subtitle">
          Logged in as <strong>{user?.email}</strong>
        </p>

        {/* DASHBOARD */}
        {activeMenu === "dashboard" && (
          <div className="section">
            <p>Active Orders: {activeOrders.length}</p>
            <p>Auction Invites: {auctions.length}</p>
          </div>
        )}

        {/* ORDERS */}
        {activeMenu === "orders" && (
          <div className="section">

            <h2>Assigned Orders</h2>

            {activeOrders.length === 0 ? (
              <p>No active orders.</p>
            ) : (
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {activeOrders.map(o => (
                    <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setSelectedOrder(o)}>
                      <td>{o.name}</td>
                      <td>{o.status}</td>
                      <td>{o.items.map(i => i.name).join(", ")}</td>

                      <td>
                        {o.status === "SUBMITTED" && (
                          <>
                            <button onClick={() => acceptOrder(o.id)}>
                              Accept
                            </button>

                            <button onClick={() => rejectOrder(o.id)}>
                              Reject
                            </button>
                          </>
                        )}

                        {o.status === "ACCEPTED" && (
                          <button className="primary-btn" onClick={() => markDelivered(o.id)}>
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* HISTORY */}
            <h2 style={{ marginTop: 40 }}>Order History</h2>

{historyOrders.length === 0 ? (
  <p>No completed orders.</p>
) : (
  <table className="records-table">
    <thead>
      <tr>
        <th>Order</th>
        <th>Status</th>
        <th>Items</th>
      </tr>
    </thead>

    <tbody>
      {historyOrders.map(o => (
        <tr
          key={o.id}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedOrder(o)}
        >
          <td>{o.name}</td>
          <td>{o.status}</td>
          <td>{o.items.map(i => i.name).join(", ")}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
          </div>
        )}

        {/* AUCTIONS */}
       {activeMenu === "auctions" && (
  <div className="section">

    <h2>Invited Auctions</h2>

    {activeAuctions.length === 0 ? (
      <p>No active auction invites.</p>
    ) : (
      <table className="records-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Closes</th>
            <th>Delivery</th>
          </tr>
        </thead>

        <tbody>
          {activeAuctions.map(a => (
            <tr
              key={a.id}
              onClick={() => setSelectedAuction(a)}
              style={{ cursor: "pointer" }}
            >
              <td>{a.name}</td>
              <td>{a.manager?.organizationName || "-"}</td>
              <td>{new Date(a.endDate).toLocaleString()}</td>
              <td>{new Date(a.deliveryDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    <h2 style={{ marginTop: 40 }}>Auction History</h2>

    {auctionHistory.length === 0 ? (
      <p>No auction history.</p>
    ) : (
      <table className="records-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Organization</th>
            <th>Status</th>
            <th>Closed</th>
          </tr>
        </thead>

        <tbody>
          {auctionHistory.map(a => (
            <tr
              key={a.id}
              onClick={() => setSelectedAuction(a)}
              style={{ cursor: "pointer" }}
            >
              <td>{a.name}</td>
              <td>{a.manager?.organizationName || "-"}</td>
              <td>{a.status}</td>
              <td>{new Date(a.endDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

  </div>
)}


{/* INVOICES */}
{activeMenu === 'invoices' && (
  <VendorInvoices />
)}
        

        {/* PROFILE */}
        {activeMenu === "profile" && (
          <div className="section">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        )}

        {selectedOrder && (
  <VendorOrderModal
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
  />
)}

{selectedAuction && (
  <VendorAuctionModal
    auction={selectedAuction}
    onClose={() => setSelectedAuction(null)}
  />
)}

      </div>
    </div>
  )
}

export default VendorDashboard