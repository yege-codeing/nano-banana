import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: expiredUsers } = await supabase
    .from('user_credits')
    .select('*')
    .lt('subscription_expires_at', new Date().toISOString())
    .gt('subscription_credits', 0)

  if (!expiredUsers || expiredUsers.length === 0) {
    return NextResponse.json({ expired: 0 })
  }

  for (const user of expiredUsers) {
    const expiredAmount = user.subscription_credits

    await supabase
      .from('user_credits')
      .update({
        total_credits: user.free_credits,
        subscription_credits: 0,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.user_id)

    await supabase.from('credit_transactions').insert({
      user_id: user.user_id,
      amount: -expiredAmount,
      transaction_type: 'expire',
      description: '订阅积分已过期'
    })
  }

  return NextResponse.json({ expired: expiredUsers.length })
}
