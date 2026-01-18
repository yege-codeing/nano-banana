import { createClient } from '@/lib/supabase/server'

export async function grantInitialCredits(userId: string) {
  const supabase = await createClient()

  const { data: existing } = await supabase
    .from('user_credits')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (existing) return { alreadyGranted: true }

  const { error: creditsError } = await supabase
    .from('user_credits')
    .insert({
      user_id: userId,
      total_credits: 10,
      free_credits: 10,
      subscription_credits: 0
    })

  if (creditsError) throw creditsError

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: 10,
    transaction_type: 'grant_initial',
    description: '初始免费积分'
  })

  return { granted: true, amount: 10 }
}
