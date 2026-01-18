import { NextResponse } from "next/server"
import { captureOrder } from "@/lib/paypal"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderID: string }> }
) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { orderID } = await params
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID)

    if (httpStatusCode === 201 || httpStatusCode === 200) {
      const { getUserCredits } = await import('@/lib/credits/get-user-credits')
      const { grantSubscriptionCredits } = await import('@/lib/credits/grant-subscription-credits')
      const { handleResubscription } = await import('@/lib/credits/handle-resubscription')

      const amount = parseFloat(jsonResponse.purchase_units?.[0]?.amount?.value || '19.00')
      const { data: userCredits } = await getUserCredits(user.id)

      if (userCredits && userCredits.subscription_credits > 0) {
        await handleResubscription(user.id, orderID, amount)
      } else {
        await grantSubscriptionCredits(user.id, orderID, amount)
      }
    }

    return NextResponse.json(jsonResponse, { status: httpStatusCode })
  } catch (error) {
    console.error("Failed to capture order:", error)
    return NextResponse.json(
      { error: "Failed to capture order." },
      { status: 500 }
    )
  }
}
