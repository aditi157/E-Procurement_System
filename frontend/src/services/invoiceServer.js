/*
  invoiceService
  - Manages vendor invoices and finance actions
*/

const STORAGE_KEY = 'invoices'

export const getAllInvoices = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

export const createInvoice = (invoice) => {
  const invoices = getAllInvoices()
  invoices.push(invoice)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

export const updateInvoiceStatus = (invoiceId, status) => {
  const updated = getAllInvoices().map((inv) =>
    inv.id === invoiceId
      ? { ...inv, status }
      : inv
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
