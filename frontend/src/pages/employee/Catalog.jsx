import React, { useState } from 'react'

const Catalog = ({ catalog, addToCart }) => {
  const [showAddedModal, setShowAddedModal] = useState(false)
  const [addedItem, setAddedItem] = useState(null)

  const handleAdd = (item) => {
    addToCart(item)
    setAddedItem(item)
    setShowAddedModal(true)

    // auto-close after 1.2s
    setTimeout(() => {
      setShowAddedModal(false)
      setAddedItem(null)
    }, 1200)
  }

  return (
    <>
      <div className="catalog-grid">
        {catalog.map((item) => (
          <div key={item.id} className="catalog-card">
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>
            <button onClick={() => handleAdd(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* ADDED TO CART MODAL */}
      {showAddedModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '360px' }}>
            <h2>Added to Cart</h2>
            <p>
              <strong>{addedItem?.name}</strong> was added to your cart.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Catalog
