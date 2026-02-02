import React from 'react'
import { useNavigate } from 'react-router-dom'

/*
  Role-based sidebar menu configuration
*/
const menusByRole = {
  employee: [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'catalog', label: 'Catalog' },
    { key: 'requests', label: 'My Requests' },
    { key: 'orders', label: 'Order Status' },
    { key: 'history', label: 'Request History' },
    { key: 'profile', label: 'My Profile' }
  ],
  manager: [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'incoming', label: 'Incoming Requests' },
    { key: 'approved', label: 'Approved Requests' },
    { key: 'auctions', label: 'Auctions' },
    { key: 'orders', label: 'Draft Orders' },
    { key: 'profile', label: 'My Profile' }
  ]
}

/*
  Sidebar component
*/
const Sidebar = ({ role, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate()
  const menus = menusByRole[role] || []

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    navigate('/')
  }

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">E-Procure</h2>

      <ul className="sidebar-menu">
        {menus.map(item => (
          <li
            key={item.key}
            className={activeMenu === item.key ? 'active' : ''}
            onClick={() => setActiveMenu(item.key)}
          >
            {item.label}
          </li>
        ))}

        <li className="logout" onClick={handleLogout}>
          Logout
        </li>

        
      </ul>
    </div>
  )
}

export default Sidebar
