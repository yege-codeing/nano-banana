// 已注释：Creem 支付 Webhook，改用 PayPal 支付
// 保留空路由以避免 Next.js 构建错误

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Webhook disabled - using PayPal' }, { status: 200 })
}

/* 原 Creem Webhook 代码：
import { Webhook } from '@creem_io/nextjs'

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onCheckoutCompleted: async ({ customer, product }) => {
    console.log(`Checkout completed: ${customer.email} purchased ${product.name}`)
  },
  onGrantAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string
    console.log(`Grant access for user: ${userId}, email: ${customer.email}`)
  },
  onRevokeAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string
    console.log(`Revoke access for user: ${userId}, email: ${customer.email}`)
  },
})
*/
