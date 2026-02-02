/*
  orderService
  - Handles purchase orders after approval / auction
*/

const STORAGE_KEY = 'purchaseOrders'

export const getAllOrders = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

export const createOrder = (order) => {
  const orders = getAllOrders()
  orders.push(order)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export const updateOrderStatus = (orderId, status) => {
  const updated = getAllOrders().map((o) =>
    o.id === orderId
      ? { ...o, status }
      : o
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const getOrdersByVendor = (vendorId) => {
  return getAllOrders().filter(
    (o) => o.vendorId === vendorId
  )
}
