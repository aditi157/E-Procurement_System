import React, { useEffect, useState } from "react"
import axios from "axios"

const AddToAuctionModal = ({ request, onClose }) => {
  const [auctions, setAuctions] = useState([])
  const [selectedAuctionId, setSelectedAuctionId] = useState(null)
  const [mode, setMode] = useState("existing")
  const [successMsg, setSuccessMsg] = useState("")

  const user = JSON.parse(localStorage.getItem("user"))

  /* ---------- LOAD AUCTIONS ---------- */
  const loadAuctions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auctions")

      const open = res.data.filter(a => a.status === "ONGOING")
      setAuctions(open)

      if (open.length === 0) setMode("new")

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAuctions()
  }, [])

  /* ---------- CREATE NEW ---------- */
  const createNewAuction = async () => {
    try {
      await axios.post("http://localhost:5000/api/auctions", {
        name: `Auction-${Date.now()}`,
        managerId: user.id,
        requestId: request.id,
        items: request.items.map(i => ({
          name: i.name,
          quantity: i.quantity
        }))
      })

      setSuccessMsg("Auction created successfully")

    } catch (err) {
      console.error(err)
      alert("Failed to create auction")
    }
  }

  /* ---------- ADD TO EXISTING ---------- */
  const addToExisting = async () => {
    if (!selectedAuctionId) return

    try {
      await axios.post(
        `http://localhost:5000/api/auctions/${selectedAuctionId}/add`,
        {
          requestId: request.id
        }
      )

      setSuccessMsg("Added to auction")

    } catch (err) {
      console.error(err)
      alert("Failed to add")
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <h2>Add Request to Auction</h2>

        {successMsg ? (
          <>
            <p>{successMsg}</p>
            <button onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="existing">Add to existing</option>
              <option value="new">Create new</option>
            </select>

            {mode === "existing" && (
              <table className="records-table">
                <tbody>
                  {auctions.map(a => (
                    <tr key={a.id}>
                      <td>
                        <input
                          type="radio"
                          checked={selectedAuctionId === a.id}
                          onChange={() => setSelectedAuctionId(a.id)}
                        />
                      </td>
                      <td>{a.name}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-actions">
              {mode === "existing" ? (
                <button className="primary-btn" onClick={addToExisting}>
                  Add to Auction
                </button>
              ) : (
                <button className="primary-btn" onClick={createNewAuction}>
                  Create Auction
                </button>
              )}

              <button className="modal-close" onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AddToAuctionModal