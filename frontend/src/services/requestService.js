/*
  requestService
  - Simulates a database table for purchase requests
  - Backed by localStorage
*/

const STORAGE_KEY = 'purchaseRequests'

// Get all requests
export const getAllRequests = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

// Get requests by employee
export const getRequestsByEmployee = (email) => {
  return getAllRequests().filter(
    (req) => req.requestedBy === email
  )
}

// Create a new purchase request
export const createRequest = (request) => {
  const requests = getAllRequests()
  requests.push(request)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
}

// Update request status (Manager actions)
export const updateRequestStatus = (id, status, reviewedBy) => {
  const updated = getAllRequests().map((req) =>
    req.id === id
      ? { ...req, status, reviewedBy }
      : req
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// Get a single request by ID
export const getRequestById = (id) => {
  return getAllRequests().find((req) => req.id === id)
}
