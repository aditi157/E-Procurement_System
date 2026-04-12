import React, { useState, useEffect } from 'react'
import axios from "axios"

const formatDateTimeLocal = (date) => {
  if (!date) return ""

  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())

  return d.toISOString().slice(0, 16)
}

const formatDateOnly = (date) => {
  if (!date) return ""

  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())

  return d.toISOString().slice(0, 10)
}


const CreateAuctionModal = ({ auction, onClose }) => {
  const [name, setName] = useState(auction?.name || '')
  const [description, setDescription] = useState(auction?.description || '')
  const [mode, setMode] = useState(auction ? 'scheduled' : 'now')

  const [startDate, setStartDate] = useState(
  formatDateTimeLocal(auction?.startDate)
)

const [endDate, setEndDate] = useState(
  formatDateTimeLocal(auction?.endDate)
)

const [deliveryDate, setDeliveryDate] = useState(
  formatDateOnly(auction?.deliveryDate)
)

  const [items, setItems] = useState(auction?.items || [])

  const [vendors, setVendors] = useState([])
  const [search, setSearch] = useState("")
  const [invited, setInvited] = useState([])

  /* ---------- LOAD VENDORS ---------- */
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auctions/vendors/list"
        )
        setVendors(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    if (!auction) loadVendors()
  }, [auction])

  /* ---------- ITEMS ---------- */
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
    if (!name.trim()) return alert('Auction name required')
    if (!endDate) return alert('End date required')
    if (!deliveryDate) return alert('Delivery date required')
    if (items.length === 0) return alert('Add at least one item')
    return true
  }

  /* ---------- INVITE UI ---------- */
  const inviteVendorUI = (vendor) => {
    if (invited.includes(vendor.id)) {
      alert("Vendor already invited")
      return
    }

    setInvited(prev => [...prev, vendor.id])
    alert(`Invited ${vendor.email}`)
  }

  /* ---------- SAVE ---------- */
  const saveAuction = async () => {
    if (!validate()) return

    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (!user) {
      alert("Session expired. Please login again.")
      return
    }

    try {
      let auctionId

      if (auction) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/auctions/${auction.id}`,
          {
            name,
            description,
            startDate,
            endDate,
            deliveryDate
          }
        )
      } else {
        // CREATE
        const res = await axios.post(
          "http://localhost:5000/api/auctions",
          {
            name,
            description,
            managerId: user.id,
            items,
            startDate: mode === "now" ? new Date() : startDate,
            endDate,
            deliveryDate
          }
        )

        auctionId = res.data.id

        // INVITE VENDORS
        for (const vendorId of invited) {
          await axios.post(
            `http://localhost:5000/api/auctions/${auctionId}/invite`,
            { vendorId }
          )
        }
      }

      onClose()

    } catch (err) {
      console.error(err)
      alert("Failed to save auction")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{auction ? 'Edit Auction' : 'Create Auction'}</h2>

        {/* BASIC */}
        <div className="form-group">
          <label>Auction Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* TIME */}
        {!auction && (
          <div className="form-group">
            <label>Start Type</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="now">Start Now</option>
              <option value="scheduled">Schedule</option>
            </select>
          </div>
        )}

        {mode === 'scheduled' && !auction && (
          <div className="form-group">
            <label>Start Date</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
        )}

        <div className="form-group">
          <label>End Date</label>
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Delivery Date</label>
          <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
        </div>

        {/* 🔥 VENDOR SEARCH (ONLY CREATE) */}
        {!auction && (
          <div className="form-group">
            <label>Invite Vendors</label>

            <input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && vendors
              .filter(v =>
                v.email.toLowerCase().includes(search.toLowerCase())
              )
              .map(v => (
                <div key={v.id} className="vendor-row">
                  {v.email}
                  <button onClick={() => inviteVendorUI(v)}>
                    Invite
                  </button>
                </div>
              ))}

            {/* INVITED LIST */}
            {invited.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <strong>Invited Vendors:</strong>
                <ul>
                  {vendors
                    .filter(v => invited.includes(v.id))
                    .map(v => (
                      <li key={v.id}>{v.email}</li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ITEMS */}
        <h3 className="section-title">Items</h3>

        <table className="cart-table">
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <input
                    value={item.name}
                    onChange={(e) =>
                      updateItem(idx, 'name', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
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