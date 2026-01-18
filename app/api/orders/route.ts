import { NextResponse } from "next/server"
import { createOrder } from "@/lib/paypal"
import { createClient } from "@/lib/supabase/server"

const VALID_PRICES = {
  "19.00": true,
  "29.00": true,
  "49.00": true,
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { amount, currency } = await request.json()

    const validatedAmount = amount || "19.00"
    if (!VALID_PRICES[validatedAmount as keyof typeof VALID_PRICES]) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    const { jsonResponse, httpStatusCode } = await createOrder(
      validatedAmount,
      currency || "USD"
    )
    return NextResponse.json(jsonResponse, { status: httpStatusCode })
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    )
  }
}
