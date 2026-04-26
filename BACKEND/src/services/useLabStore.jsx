/**
 * useLabStore — lightweight global state via React context.
 * Replace mock data with API calls from services/api.js when backend is ready.
 */
import { createContext, useContext, useState, useCallback } from 'react'

const LabCtx = createContext(null)

const INITIAL = {
  labOnline:    true,
  notifications: [
    { id:1, type:'warning', msg:'NaCl stock below minimum', time:'10m ago' },
    { id:2, type:'danger',  msg:'Acorn Extract out of stock', time:'1h ago' },
    { id:3, type:'info',    msg:'Kelp batch cycle 12 done',  time:'2h ago' },
  ],
  activeExperiments: 3,
}

export function LabStoreProvider({ children }) {
  const [state, setState] = useState(INITIAL)

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  const dismissNotification = useCallback((id) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }))
  }, [])

  return (
    <LabCtx.Provider value={{ ...state, update, dismissNotification }}>
      {children}
    </LabCtx.Provider>
  )
}

export function useLabStore() {
  const ctx = useContext(LabCtx)
  if (!ctx) throw new Error('useLabStore must be used inside LabStoreProvider')
  return ctx
}
