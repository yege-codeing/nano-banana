"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { PayPalCheckout } from "@/components/paypal-checkout"
import { Button } from "@/components/ui/button"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "Pro"
  const amount = searchParams.get("amount") || "19.00"

  const handleSuccess = (details: unknown) => {
    console.log("Payment successful!", details)
    window.location.href = "/pricing/success"
  }

  const handleError = (error: unknown) => {
    console.error("Payment failed:", error)
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🍌</span>
              <span className="text-xl font-bold">Nano Banana</span>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Checkout Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Purchase</h1>
              <p className="text-muted-foreground">
                Subscribe to {plan} Plan
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-6 md:gap-8">
              {/* Order Summary - Left Side */}
              <div className="md:col-span-2 order-2 md:order-1">
                <div className="bg-muted/30 border rounded-lg p-6 sticky top-24">
                  <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{plan} Plan</span>
                      <span>${amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Billing cycle</span>
                      <span>Monthly</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${amount} USD</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recurring monthly payment
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure checkout powered by PayPal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form - Right Side */}
              <div className="md:col-span-3 order-1 md:order-2">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="font-semibold text-lg mb-6">Payment Method</h2>
                  
                  <PayPalCheckout
                    amount={amount}
                    currency="USD"
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
