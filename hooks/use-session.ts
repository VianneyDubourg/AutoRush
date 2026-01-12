"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/auth-client'
import type { User } from '@supabase/supabase-js'

export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsPending(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsPending(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    data: user ? { user: { id: user.id, email: user.email, name: user.user_metadata?.name, image: user.user_metadata?.avatar_url } } : null,
    isPending,
  }
}
