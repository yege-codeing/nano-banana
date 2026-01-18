import { createClient } from '@/lib/supabase/server'

export async function handleResubscription(
  userId: string,
  paypalOrderId: string,
  amount: number
) {
  const supabase = await createClient()

  const { data: userCredits } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!userCredits) throw new Error('用户积分记录不存在')

  const creditsMap: Record<string, number> = {
    '19.00': 100,
    '29.00': 200,
    '49.00': 500
  }
  const newCredits = creditsMap[amount.toFixed(2)] || 100

  const newExpiresAt = new Date()
  newExpiresAt.setMonth(newExpiresAt.getMonth() + 1)

  const { error: updateError } = await supabase
    .from('user_credits')
    .update({
      total_credits: userCredits.free_credits + newCredits,
      subscription_credits: newCredits,
      subscription_expires_at: newExpiresAt.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)

  if (updateError) throw updateError

  await supabase.from('subscriptions').insert({
    user_id: userId,
    paypal_order_id: paypalOrderId,
    amount,
    status: 'active',
    credits_granted: newCredits,
    expires_at: newExpiresAt.toISOString()
  })

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: newCredits,
    transaction_type: 'grant_subscription',
    description: `重复订阅积分 $${amount}`,
    metadata: { paypal_order_id: paypalOrderId }
  })

  return { success: true, credits: newCredits, expiresAt: newExpiresAt }
}
