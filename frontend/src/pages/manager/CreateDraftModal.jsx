import React, { useEffect, useState } from 'react'

const catalog = {
  'IT Equipment': [
    { id: 'IT-001', name: 'Laptop', price: 70000 },
    { id: 'IT-002', name: 'Monitor', price: 15000 }
  ],
  'Office Supplies': [
    { id: 'OS-001', name: 'Keyboard', price: 2500 },
    { id: 'OS-002', name: 'Mouse', price: 1200 }
  ]
}

const CreateDraftModal = ({ existingDraft, onSave, onClose }) => {
  const [cart, setCart] = useState([])
  const [draftName, setDraftName] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [toast, setToast] = useState('')


  useEffect(() => {
    if (existingDraft) {
      setCart(existingDraft.items)
      setDraftName(existingDraft.name)
    } else {
      setCart([])
      setDraftName(`Draft Order ${new Date().toLocaleDateString()}`)
    }
  }, [existingDraft])

  /* ---------- CART LOGIC ---------- */

  const addToCart = (item) => {
  setCart((prev) => {
    const existing = prev.find((i) => i.id === item.id)
    if (existing) {
      showToast('Item quantity increased')
      return prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    }
    showToast('Item added to cart')
    return [...prev, { ...item, quantity: 1 }]
  })
}


  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    )
  }

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    )
  }

const removeItem = (id) => {
  setCart((prev) => prev.filter((i) => i.id !== id))
  showToast('Item removed from cart')
}


  const totalAmount = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const saveDraft = () => {
    if (cart.length === 0) return

    onSave({
      id: existingDraft?.id || `DRAFT-${Date.now()}`,
      name: draftName,
      status: 'Draft',
      createdAt: existingDraft?.createdAt || new Date().toISOString(),
      items: cart
    })
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
    }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{
          width: '85%',
          maxWidth: '900px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2>
            {existingDraft ? 'Edit Draft Order' : 'Create Order Draft'}
          </h2>

          <button
            className="cart-button"
            onClick={() => setShowCart((p) => !p)}
          >
            🛒 Cart ({cart.length})
          </button>
        </div>

{toast && (
  <div
    style={{
      marginTop: 12,
      marginBottom: 8,
      padding: '8px 12px',
      background: '#eff6ff',
      color: '#1e40af',
      borderRadius: 8,
      fontSize: '0.9rem',
      textAlign: 'center'
    }}
  >
    {toast}
  </div>
)}


        {/* DRAFT NAME */}
        <div style={{ marginTop: 20 }}>
        <label
            style={{
            display: 'block',
            marginBottom: 6,
            fontWeight: 600,
            color: '#334155'
            }}
        >
            Draft Name
        </label>

        <input
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Enter order name"
            style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            fontSize: '0.95rem'
            }}
        />
        </div>


        {/* CATALOG */}
        {!showCart &&
          Object.entries(catalog).map(([category, items]) => (
            <div key={category} style={{ marginTop: 24 }}>
              <h3>{category}</h3>

              <div className="catalog-grid">
                {items.map((item) => (
                  <div key={item.id} className="catalog-card">
                    <h3>{item.name}</h3>
                    <p className="price">₹{item.price}</p>
                    <button onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* CART */}
        {showCart && (
          <>
            <h3 style={{ marginTop: 24 }}>Cart</h3>
            {cart.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <>
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((i) => (
                      <tr key={i.id}>
                        <td>{i.name}</td>
                        <td>
                          <button onClick={() => decreaseQty(i.id)}>-</button>
                          {i.quantity}
                          <button onClick={() => increaseQty(i.id)}>+</button>
                        </td>
                        <td>₹{i.price * i.quantity}</td>
                        <td>
                          <button onClick={() => removeItem(i.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="cart-total">
                  Total: ₹{totalAmount()}
                </p>
              </>
            )}
          </>
        )}

        {/* ACTIONS */}
        <button onClick={saveDraft}>Save Draft</button>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default CreateDraftModal
