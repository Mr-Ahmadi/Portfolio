import { createContext, useContext } from 'react'

export const AiBusyContext = createContext(false)

export function useAiBusy() {
  return useContext(AiBusyContext)
}
