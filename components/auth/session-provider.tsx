"use client"

import { ReactNode } from "react"

export function SessionProvider({ children }: { children: ReactNode }) {
  // BetterAuth utilise son propre contexte via le client
  // Pas besoin de wrapper supplémentaire
  return <>{children}</>
}
