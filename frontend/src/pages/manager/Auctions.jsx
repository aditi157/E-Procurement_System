import React, { useEffect, useState } from 'react'
import CreateAuctionModal from './CreateAuctionModal'

const Auctions = () => {
  const [auctions, setAuctions] = useState(() => {
    return JSON.parse(localStorage.getItem('auctions')) || []
  })

  const [showModal, setShowModal] = useState(false)
  const [editingAuction, setEditingAuction] = useState(null)

  /* ---------- Persist ---------- */
  useEffect(() => {
    localStorage.setItem('auctions', JSON.stringify(auctions))
  }, [auctions])

  /* ---------- Auto status updates ---------- */
  useEffect(() => {
    const now = new Date()
    setAuctions(prev =>
      prev.map(a => {
        if (a.status === 'Scheduled' && new Date(a.startDate) <= now) {
          return { ...a, status: 'Ongoing' }
        }
        if (a.status === 'Ongoing' && new Date(a.endDate) <= now) {
          return { ...a, status: 'Closed' }
        }
        return a
      })
    )
  }, [])

  /* ---------- Actions ---------- */
  const saveAuction = (auction) => {
    setAuctions(prev => {
      const exists = prev.find(a => a.id === auction.id)
      return exists
        ? prev.map(a => (a.id === auction.id ? auction : a))
        : [...prev, auction]
    })
  }

  const cancelAuction = (id) => {
    setAuctions(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: 'Closed' } : a
      )
    )
  }

  const closeEarly = (id) => {
    setAuctions(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: 'Closed' } : a
      )
    )
  }

  /* ---------- Sections ---------- */
  const ongoing = auctions.filter(a => a.status === 'Ongoing')
  const scheduled = auctions.filter(a => a.status === 'Scheduled')
  const history = auctions.filter(a => a.status === 'Closed')

  const renderCards = (list, actions) => (
    <div className="catalog-grid">
      {list.map(a => (
        <div key={a.id} className="catalog-card">
          <h3>{a.name}</h3>
          <p><strong>Categories:</strong> {a.categories.join(', ')}</p>
          <p><strong>Ends:</strong> {new Date(a.endDate).toLocaleString()}</p>

          {actions(a)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="section">
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
      {ongoing.length === 0 ? <p>No ongoing auctions</p> :
        renderCards(ongoing, (a) => (
          <button onClick={() => closeEarly(a.id)}>
            Close Auction
          </button>
        ))
      }

      {/* SCHEDULED */}
      <h2 style={{ marginTop: 40 }}>Scheduled Auctions</h2>
      {scheduled.length === 0 ? <p>No scheduled auctions</p> :
        renderCards(scheduled, (a) => (
          <>
            <button
              onClick={() => {
                setEditingAuction(a)
                setShowModal(true)
              }}
            >
              Edit
            </button>
            <button
              style={{ marginTop: 8, background: '#dc2626' }}
              onClick={() => cancelAuction(a.id)}
            >
              Cancel
            </button>
          </>
        ))
      }

      {/* HISTORY */}
      <h2 style={{ marginTop: 40 }}>Auction History</h2>
      {history.length === 0 ? <p>No past auctions</p> :
        renderCards(history, () => null)
      }

      {/* MODAL */}
      {showModal && (
        <CreateAuctionModal
          auction={editingAuction}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            saveAuction(data)
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

export default Auctions
