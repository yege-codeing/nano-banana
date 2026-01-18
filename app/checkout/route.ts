// 已注释：Creem Checkout 路由，改用 PayPal 支付
// 保留空路由以避免 Next.js 构建错误

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Checkout disabled - using PayPal' }, { status: 200 })
}

/* 原 Creem Checkout 代码：
import { Checkout } from '@creem_io/nextjs'

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true,
  defaultSuccessUrl: '/pricing/success',
})
*/
