'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function CreditsDisplay() {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchCredits() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_credits')
        .select('total_credits')
        .eq('user_id', user.id)
        .single()

      setCredits(data?.total_credits ?? 0)
      setLoading(false)
    }

    fetchCredits()

    const channel = supabase
      .channel('credits-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_credits'
      }, (payload) => {
        setCredits(payload.new.total_credits)
      })
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [])

  if (loading) return null

  return (
    <div className="flex items-center gap-3">
      <Badge variant={credits && credits > 0 ? 'default' : 'destructive'}>
        {credits ?? 0} Credits
      </Badge>
      {credits !== null && credits < 1 && (
        <Button
          size="sm"
          onClick={() => router.push('/pricing')}
        >
          获取积分
        </Button>
      )}
    </div>
  )
}
