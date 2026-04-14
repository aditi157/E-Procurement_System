import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

/* ─── Provider ─────────────────────────────────────────────────────────── */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => t.id === id ? { ...t, exiting: true } : t)
      )
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 280)
    }, duration)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts(prev =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    )
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 280)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

/* ─── Hook ──────────────────────────────────────────────────────────────── */
export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.addToast
}

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

/* ─── Toast Container (rendered by provider) ────────────────────────────── */
const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast toast-${t.type}${t.exiting ? ' toast-exit' : ''}`}
        >
          <span className="toast-icon">{ICONS[t.type] || ICONS.info}</span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-dismiss" onClick={() => onDismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  )
}