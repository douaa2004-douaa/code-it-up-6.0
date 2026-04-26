import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastCtx = createContext(null)

export function useToast() {
  return useContext(ToastCtx)
}

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((msg, type = 'info', duration = 3500) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const ICONS  = { success:'✅', warning:'⚠️', danger:'❌', info:'🫧' }
  const COLORS = {
    success: 'rgba(76,175,80,0.15)',
    warning: 'rgba(255,152,0,0.15)',
    danger:  'rgba(244,67,54,0.15)',
    info:    'rgba(0,188,212,0.15)',
  }
  const BORDERS = {
    success: 'rgba(76,175,80,0.4)',
    warning: 'rgba(255,152,0,0.4)',
    danger:  'rgba(244,67,54,0.4)',
    info:    'rgba(0,188,212,0.4)',
  }

  return (
    <ToastCtx.Provider value={push}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white pointer-events-auto"
            style={{
              background: COLORS[t.type],
              border: `1px solid ${BORDERS[t.type]}`,
              backdropFilter: 'blur(16px)',
              animation: 'slideUp 0.3s ease-out forwards',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              maxWidth: 320,
            }}
          >
            <span>{ICONS[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
