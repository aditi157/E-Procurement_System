import React, { useState } from 'react'

const CATEGORY_OPTIONS = [
  'IT',
  'Office Supplies',
  'Furniture',
  'Electronics',
  'Maintenance'
]

const CreateAuctionModal = ({ auction, onClose, onSave }) => {
  const [name, setName] = useState(auction?.name || '')
  const [description, setDescription] = useState(auction?.description || '')
  const [mode, setMode] = useState(
    auction?.status === 'Scheduled' ? 'scheduled' : 'now'
  )
  const [startDate, setStartDate] = useState(auction?.startDate || '')
  const [endDate, setEndDate] = useState(auction?.endDate || '')
  const [deliveryDate, setDeliveryDate] = useState(auction?.deliveryDate || '')
  const [categories, setCategories] = useState(auction?.categories || [])
  const [items, setItems] = useState(auction?.items || [])

  const addItem = () =>
    setItems(prev => [...prev, { name: '', quantity: 1 }])

  const updateItem = (idx, field, value) => {
    const copy = [...items]
    copy[idx][field] = value
    setItems(copy)
  }

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    if (!name.trim()) {
      alert('Auction name is required')
      return false
    }

    if (mode === 'scheduled' && !startDate) {
      alert('Start date is required for scheduled auctions')
      return false
    }

    if (!endDate) {
      alert('Auction end date is required')
      return false
    }

    if (!deliveryDate) {
      alert('Expected delivery date is required')
      return false
    }

    if (categories.length === 0) {
      alert('Please select at least one category')
      return false
    }

    if (items.length === 0) {
      alert('Please add at least one item')
      return false
    }

    for (const item of items) {
      if (!item.name.trim()) {
        alert('All items must have a name')
        return false
      }
      if (!item.quantity || item.quantity <= 0) {
        alert('Item quantity must be greater than 0')
        return false
      }
    }

    return true
  }

  const saveAuction = () => {
    if (!validate()) return

    onSave({
      id: auction?.id || `AUC-${Date.now()}`,
      name,
      description,
      status:
        auction?.status ||
        (mode === 'now' ? 'Ongoing' : 'Scheduled'),
      startDate:
        mode === 'now'
          ? new Date().toISOString()
          : startDate,
      endDate,
      deliveryDate,
      categories,
      items
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{auction ? 'Edit Auction' : 'Create Auction'}</h2>

        {/* BASIC INFO */}
        <div className="form-group">
          <label>Auction Name</label>
          <input
            placeholder="e.g. Q1 IT Hardware Procurement"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description (optional)</label>
          <textarea
            placeholder="Optional notes for vendors"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* TIMING */}
        <div className="form-group">
          <label>Start Type</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="now">Start Immediately</option>
            <option value="scheduled">Schedule for Later</option>
          </select>
        </div>

        {mode === 'scheduled' && (
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Auction End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expected Delivery Date</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        {/* CATEGORIES */}
        <div className="form-group">
          <label>Categories</label>
          <div className="category-grid">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  categories.includes(cat)
                    ? 'category-pill active'
                    : 'category-pill'
                }
                onClick={() =>
                  setCategories((prev) =>
                    prev.includes(cat)
                      ? prev.filter((c) => c !== cat)
                      : [...prev, cat]
                  )
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ITEMS */}
        <h3 className="section-title">Items</h3>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(idx, 'name', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, 'quantity', +e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => removeItem(idx)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addItem}>+ Add Item</button>

        {/* ACTIONS */}
        <div className="modal-actions vertical">
          <button className="primary-btn" onClick={saveAuction}>
            Save Auction
          </button>

          <button className="modal-close" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAuctionModal
