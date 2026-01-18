import { createClient } from '@/lib/supabase/server'

export async function grantSubscriptionCredits(
  userId: string,
  paypalOrderId: string,
  amount: number
) {
  const supabase = await createClient()

  const creditsMap: Record<string, number> = {
    '19.00': 100,
    '29.00': 200,
    '49.00': 500
  }

  const creditsToGrant = creditsMap[amount.toFixed(2)] || 100
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  const { data: userCredits, error: fetchError } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (fetchError) throw fetchError

  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      total_credits: userCredits.total_credits + creditsToGrant,
      subscription_credits: userCredits.subscription_credits + creditsToGrant,
      subscription_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) throw updateError

  await supabase.from('subscriptions').insert({
    user_id: userId,
    paypal_order_id: paypalOrderId,
    amount,
    status: 'active',
    credits_granted: creditsToGrant,
    expires_at: expiresAt.toISOString()
  })

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: creditsToGrant,
    transaction_type: 'grant_subscription',
    description: `订阅积分 $${amount}`,
    metadata: { paypal_order_id: paypalOrderId }
  })

  return { granted: true, amount: creditsToGrant, expiresAt }
}
