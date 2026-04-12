import React, { useEffect, useState } from "react"
import axios from "axios"
import FinanceSidebar from "./FinanceSidebar"
import FinanceInvoiceModal from "./FinanceInvoiceModal"

const FinanceDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))

  const loadInvoices = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await axios.get(
        "http://localhost:5000/api/finance/invoices",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setInvoices(res.data)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const pending = invoices.filter(
    i => i.status === "SUBMITTED" || i.status === "PENDING"
  )

  const history = invoices.filter(
    i =>
      i.status === "PAID" ||
      i.status === "REJECTED"
  )

  const renderTable = (list) => (
    <table className="records-table">
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Vendor</th>
          <th>Order</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {list.map(i => (
          <tr
            key={i.id}
            onClick={() => setSelectedInvoice(i)}
            style={{ cursor: "pointer" }}
          >
            <td>{i.invoiceNumber}</td>
            <td>{i.vendorOrder.vendor?.name}</td>
            <td>{i.vendorOrder.order.name}</td>
            <td>₹{i.totalAmount}</td>
            <td>{i.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const getPageTitle = () => {
    switch (activeMenu) {
      case "invoices":
        return "Invoices"
      case "profile":
        return "Profile"
      default:
        return "Finance Dashboard"
    }
  }

  return (
    <div className="dashboard-layout">
      <FinanceSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="dashboard-content">
        <h1 className="title">{getPageTitle()}</h1>

        <p className="subtitle">
          Logged in as <strong>{user?.email}</strong>
        </p>

        {(activeMenu === "dashboard" ||
          activeMenu === "invoices") && (
          <>
            <div className="section">
              <p>Total Invoices: {invoices.length}</p>
              <p>Pending Review: {pending.length}</p>
              <p>Processed: {history.length}</p>
            </div>

            <h2>Pending Invoice Review</h2>
            {pending.length === 0
              ? <p>No pending invoices</p>
              : renderTable(pending)
            }

            <h2 style={{ marginTop: 40 }}>
              Invoice History
            </h2>
            {history.length === 0
              ? <p>No invoice history</p>
              : renderTable(history)
            }
          </>
        )}

        {activeMenu === "profile" && (
          <div className="section">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p>
              <strong>Organization:</strong>{" "}
              {user.organizationName}
            </p>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <FinanceInvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setSelectedInvoice(null)
            loadInvoices()
          }}
        />
      )}
    </div>
  )
}

export default FinanceDashboard