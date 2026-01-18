import { createClient } from '@/lib/supabase/server'

export async function getUserCredits(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return { data: null, error }

  return { data, error: null }
}
