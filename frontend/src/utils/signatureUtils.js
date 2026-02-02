/*
  Digital signature utilities
  Algorithm: ECDSA with P-256 + SHA-256
*/

export const generateKeyPair = async () => {
  return await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify']
  )
}

const exportKey = async (key) => {
  const jwk = await crypto.subtle.exportKey('jwk', key)
  return JSON.stringify(jwk)
}

const importKey = async (keyData, type) => {
  return await crypto.subtle.importKey(
    'jwk',
    JSON.parse(keyData),
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    type === 'private' ? ['sign'] : ['verify']
  )
}

export const setupKeysForOrg = async (orgName) => {
  const keyPair = await generateKeyPair()
  localStorage.setItem(`${orgName}_privateKey`, await exportKey(keyPair.privateKey))
  localStorage.setItem(`${orgName}_publicKey`, await exportKey(keyPair.publicKey))
}

export const signHash = async (orgName, hash) => {
  const privateKeyData = localStorage.getItem(`${orgName}_privateKey`)
  const privateKey = await importKey(privateKeyData, 'private')

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    new TextEncoder().encode(hash)
  )

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

export const verifySignature = async (orgName, hash, signature) => {
  const publicKeyData = localStorage.getItem(`${orgName}_publicKey`)
  const publicKey = await importKey(publicKeyData, 'public')

  const sigBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0))

  return await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    sigBytes,
    new TextEncoder().encode(hash)
  )
}
