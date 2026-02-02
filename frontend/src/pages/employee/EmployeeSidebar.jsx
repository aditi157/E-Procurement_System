import React from 'react'
import { useNavigate } from 'react-router-dom'

/*
  EmployeeSidebar
  - Sidebar specific to Employee dashboard
  - Uses same class names as global sidebar
  - Safe to style independently later if needed
*/
const EmployeeSidebar = ({ activeMenu, setActiveMenu }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    navigate('/')
  }

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">E-Procurement</h2>

      <ul className="sidebar-menu">
        <li
          className={activeMenu === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveMenu('dashboard')}
        >
          Dashboard
        </li>

        <li
          className={activeMenu === 'catalog' ? 'active' : ''}
          onClick={() => setActiveMenu('catalog')}
        >
          Catalog
        </li>

        <li
          className={activeMenu === 'requests' ? 'active' : ''}
          onClick={() => setActiveMenu('requests')}
        >
          My Requests
        </li>


        <li
          className={activeMenu === 'history' ? 'active' : ''}
          onClick={() => setActiveMenu('history')}
        >
          Request History
        </li>

        <li
          className={activeMenu === 'profile' ? 'active' : ''}
          onClick={() => setActiveMenu('profile')}
        >
          My Profile
        </li>

        <li className="logout" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  )
}

export default EmployeeSidebar
