/*
  hashUtils.js
  Utility functions for cryptographic hashing
  Uses SHA-256 via Web Crypto API
*/

// Convert string to ArrayBuffer
const encode = (str) => {
  return new TextEncoder().encode(str)
}

// Generate SHA-256 hash
export const generateHash = async (data) => {
  const encodedData = encode(JSON.stringify(data))
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedData)

  // Convert buffer to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
