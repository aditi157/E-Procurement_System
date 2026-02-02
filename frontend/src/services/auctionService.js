/*
  auctionService
  - Manages auctions linked to purchase requests
*/

const STORAGE_KEY = 'auctions'

export const getAllAuctions = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}

export const createAuction = (auction) => {
  const auctions = getAllAuctions()
  auctions.push(auction)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auctions))
}

export const addBidToAuction = (auctionId, bid) => {
  const updated = getAllAuctions().map((a) =>
    a.id === auctionId
      ? { ...a, bids: [...a.bids, bid] }
      : a
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const closeAuction = (auctionId, winningBid) => {
  const updated = getAllAuctions().map((a) =>
    a.id === auctionId
      ? { ...a, status: 'Closed', winningBid }
      : a
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
