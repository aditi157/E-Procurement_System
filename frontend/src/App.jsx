// import { Routes, Route, Navigate } from 'react-router-dom'

// // Public pages
// import LandingPage from './pages/LandingPage'
// import LoginPage from './pages/LoginPage'

// // Dashboards
// import EmployeeDashboard from './pages/employee/EmployeeDashboard'
// import ManagerDashboard from './pages/manager/ManagerDashboard'

// function App() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<LoginPage />} />

//       {/* Dashboards */}
//       <Route path="/employee" element={<EmployeeDashboard />} />
//       <Route path="/manager" element={<ManagerDashboard />} />

//       {/* Fallback route */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }

// export default App


import { Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

// Dashboards
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import VendorDashboard from './pages/vendor/VendorDashboard'
import FinanceDashboard from './pages/finance/FinanceDashboard'

/* =========================================================
   DEMO SEED DATA (RUNS ONCE)
   Screenshot-ready frontend prototype data
========================================================= */
const seedDemoData = () => {
  if (localStorage.getItem('DEMO_SEEDED')) return

  /* ---------- PURCHASE REQUESTS ---------- */
  localStorage.setItem(
    'purchaseRequests',
    JSON.stringify([
      {
        id: 'REQ-001',
        requestedBy: 'employee@company.com',
        status: 'Completed',
        createdAt: new Date().toISOString(),
        items: [{ name: 'Laptop', quantity: 5, price: 60000 }]
      },
      {
        id: 'REQ-002',
        requestedBy: 'employee@company.com',
        status: 'Approved',
        createdAt: new Date().toISOString(),
        items: [{ name: 'Printer', quantity: 2, price: 15000 }]
      }
    ])
  )

  /* ---------- MANAGER ORDERS ---------- */
  localStorage.setItem(
    'manager_orders',
    JSON.stringify([
      {
        id: 'ORD-001',
        name: 'Office Equipment Order',
        status: 'Draft',
        createdAt: new Date().toISOString(),
        items: [{ name: 'Printer', quantity: 2, price: 15000 }],
        sourceRequests: ['REQ-002']
      },
      {
        id: 'ORD-002',
        name: 'IT Hardware Order',
        status: 'Assigned',
        vendorId: 'vendor-001',
        createdAt: new Date().toISOString(),
        items: [{ name: 'Laptop', quantity: 5, price: 60000 }],
        sourceRequests: ['REQ-001']
      },
      {
        id: 'ORD-003',
        name: 'Completed Furniture Order',
        status: 'Paid',
        vendorId: 'vendor-001',
        createdAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        items: [{ name: 'Office Chair', quantity: 10, price: 7000 }],
        sourceRequests: []
      }
    ])
  )

  /* ---------- AUCTIONS (MATCHES MANAGER UI) ---------- */
  localStorage.setItem(
    'auctions',
    JSON.stringify([
      {
        id: 'AUC-001',
        title: 'Bulk Laptop Procurement',
        status: 'Open',
        createdAt: new Date().toISOString(),
        items: [{ name: 'Laptop', quantity: 5 }],
        invitedVendors: [],
        openToAll: true,
        bids: []
      },
      {
        id: 'AUC-002',
        title: 'Printer Supplies Auction',
        status: 'Closed',
        createdAt: new Date().toISOString(),
        items: [{ name: 'Printer', quantity: 2 }],
        invitedVendors: ['vendor-001'],
        openToAll: false,
        bids: [
          {
            vendorId: 'vendor-001',
            price: 14000,
            deliveryDays: 5
          }
        ],
        winningBid: {
          vendorId: 'vendor-001',
          price: 14000,
          deliveryDays: 5
        }
      }
    ])
  )

  /* ---------- VENDOR INVOICES ---------- */
  localStorage.setItem(
    'invoices',
    JSON.stringify([
      {
        id: 'INV-001',
        orderId: 'ORD-002',
        vendorId: 'vendor-001',
        amount: 300000,
        status: 'Pending'
      },
      {
        id: 'INV-002',
        orderId: 'ORD-003',
        vendorId: 'vendor-001',
        amount: 70000,
        status: 'Paid'
      }
    ])
  )

  localStorage.setItem('DEMO_SEEDED', 'true')
}
/* ========================================================= */

function App() {
  seedDemoData()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboards */}
      <Route path="/employee/*" element={<EmployeeDashboard />} />
      <Route path="/manager/*" element={<ManagerDashboard />} />
      <Route path="/vendor/*" element={<VendorDashboard />} />
      <Route path="/finance/*" element={<FinanceDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
