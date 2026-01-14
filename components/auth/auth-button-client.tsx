"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { GoogleSignInButton } from "./google-sign-in-button"
import { UserNav } from "./user-nav"
import type { User } from "@supabase/supabase-js"

export function AuthButtonClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  if (loading) {
    return null
  }

  if (user) {
    return <UserNav user={user} />
  }

  return <GoogleSignInButton />
}
