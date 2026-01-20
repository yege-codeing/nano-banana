import { createServiceClient } from '@/lib/supabase/server'

export async function consumeCredits(userId: string, amount: number = 1) {
  const supabase = await createServiceClient()

  const { data, error } = await supabase.rpc('consume_user_credits', {
    p_user_id: userId,
    p_amount: amount
  })

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error('No data returned from consume_user_credits')
  }

  const result = data[0]

  if (!result.success) {
    return {
      success: false,
      error: result.error_message,
      remaining: result.remaining_credits
    }
  }

  return {
    success: true,
    remaining: result.remaining_credits
  }
}
