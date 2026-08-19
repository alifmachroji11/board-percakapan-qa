import { createContext, useContext } from 'react'

const CoupleContext = createContext(null)

export function CoupleProvider({ value, children }) {
  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>
}

// { couple: {id, invite_code, current_week}, me: {user_id, display_name},
//   partner: {user_id, display_name} | null, refresh: () => Promise<void> }
export function useCouple() {
  const ctx = useContext(CoupleContext)
  if (!ctx) throw new Error('useCouple dipanggil di luar CoupleProvider')
  return ctx
}
