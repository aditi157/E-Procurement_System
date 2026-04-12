import React, { useEffect, useState } from 'react'
import CreateAuctionModal from './CreateAuctionModal'
import ManagerAuctionDetailsModal from './ManagerAuctionDetailsModal'
import axios from "axios"

const Auctions = () => {
  const [auctions, setAuctions] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [editingAuction, setEditingAuction] = useState(null)

  const [selectedAuction, setSelectedAuction] = useState(null)

  /* ---------- LOAD ---------- */
  const loadAuctions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auctions"
      )

      setAuctions(res.data)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAuctions()
  }, [])

  /* ---------- STATUS FILTERS ---------- */
  const now = new Date()

  const ongoing = auctions.filter(a =>
  a.status !== "COMPLETED" &&
  new Date(a.startDate) <= now &&
  new Date(a.endDate) > now
)

const scheduled = auctions.filter(a =>
  a.status !== "COMPLETED" &&
  new Date(a.startDate) > now
)

const history = auctions.filter(a =>
  a.status === "COMPLETED" ||
  new Date(a.endDate) <= now
)

  /* ---------- CARD RENDER ---------- */
  const renderCards = (list) => (
    <div className="catalog-grid">
      {list.map(a => (
        <div
          key={a.id}
          className="catalog-card"
        >
          <h3>{a.name}</h3>

          <p>
            <strong>Items:</strong>{" "}
            {a.items?.map(i => i.name).join(", ")}
          </p>

          <p>
            <strong>Ends:</strong>{" "}
            {new Date(a.endDate).toLocaleString()}
          </p>

          <div
  style={{
    display: "flex",
    gap: 8,
    marginTop: 12
  }}
>
  <button
    onClick={(e) => {
      e.stopPropagation()
      setSelectedAuction(a)
    }}
  >
    View
  </button>

  {a.status !== "COMPLETED" && new Date(a.endDate) > now && (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setEditingAuction(a)
        setShowModal(true)
      }}
    >
      Edit
    </button>
  )}
</div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="section">

      {/* CREATE BUTTON */}
      <div className="top-actions">
        <button
          className="cart-button"
          onClick={() => {
            setEditingAuction(null)
            setShowModal(true)
          }}
        >
          + Create Auction
        </button>
      </div>

      {/* ONGOING */}
      <h2>Ongoing Auctions</h2>
      {ongoing.length === 0
        ? <p>No ongoing auctions</p>
        : renderCards(ongoing)
      }

      {/* SCHEDULED */}
      <h2 style={{ marginTop: 40 }}>
        Scheduled Auctions
      </h2>
      {scheduled.length === 0
        ? <p>No scheduled auctions</p>
        : renderCards(scheduled)
      }

      {/* HISTORY */}
      <h2 style={{ marginTop: 40 }}>
        Auction History
      </h2>
      {history.length === 0
        ? <p>No past auctions</p>
        : renderCards(history)
      }

      {/* EDIT / CREATE MODAL */}
      {showModal && (
        <CreateAuctionModal
          auction={editingAuction}
          onClose={() => {
            setShowModal(false)
            setEditingAuction(null)
            loadAuctions()
          }}
        />
      )}

      {/* VIEW DETAILS / BIDS MODAL */}
      {selectedAuction && (
        <ManagerAuctionDetailsModal
          auction={selectedAuction}
          onClose={() => {
            setSelectedAuction(null)
            loadAuctions()
          }}
        />
      )}

    </div>
  )
}

export default Auctions