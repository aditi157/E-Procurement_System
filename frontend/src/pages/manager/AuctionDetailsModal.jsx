import React from "react"

const [bids, setBids] = useState([])

useEffect(() => {
  axios.get(`/api/auctions/${auction.id}/bids`)
    .then(res => setBids(res.data))
}, [])


const selectBid = async (bidId) => {
  await axios.post(
    `/api/auctions/${auction.id}/select-bid/${bidId}`
  )

  alert("Bid selected — Order created")
  onClose()
}

const AuctionDetailsModal = ({ auction, onClose }) => {

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{auction.name}</h2>

        <p><strong>Description:</strong> {auction.description}</p>

        <p>
          <strong>Start:</strong>{" "}
          {new Date(auction.startDate).toLocaleString()}
        </p>

        <p>
          <strong>End:</strong>{" "}
          {new Date(auction.endDate).toLocaleString()}
        </p>

        <h3>Items</h3>
        <table className="cart-table">
          <tbody>
            {auction.items.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>{i.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

{new Date(auction.endDate) <= new Date() && (
  <>
    <h3>Bids</h3>

    <table className="records-table">
      <thead>
        <tr>
          <th>Vendor</th>
          <th>Amount</th>
          <th>Delivery</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {bids.map(b => (
          <tr key={b.id}>
            <td>{b.vendor.organizationName}</td>
            <td>₹{b.amount}</td>
            <td>{new Date(b.deliveryDate).toLocaleDateString()}</td>
            <td>{b.notes}</td>

            <td>
              <button onClick={() => selectBid(b.id)}>
                Select Bid
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default AuctionDetailsModal