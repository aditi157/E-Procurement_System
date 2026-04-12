import React from "react"
import { useNavigate } from "react-router-dom"

const FinanceSidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">E-Procurement</h2>

      <ul className="sidebar-menu">
        <li
          className={activeMenu === "dashboard" ? "active" : ""}
          onClick={() => setActiveMenu("dashboard")}
        >
          Dashboard
        </li>

        <li
          className={activeMenu === "invoices" ? "active" : ""}
          onClick={() => setActiveMenu("invoices")}
        >
          Invoices
        </li>

        <li
          className={activeMenu === "profile" ? "active" : ""}
          onClick={() => setActiveMenu("profile")}
        >
          Profile
        </li>

        <li className="logout" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  )
}

export default FinanceSidebar