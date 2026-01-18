"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

interface PayPalCheckoutProps {
  amount: string
  currency?: string
  onSuccess?: (details: unknown) => void
  onError?: (error: unknown) => void
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: unknown) => { render: (selector: string) => void }
      CardFields: (config: unknown) => {
        isEligible: () => boolean
        NameField: (config?: unknown) => { render: (selector: string) => void }
        NumberField: (config?: unknown) => { render: (selector: string) => void }
        CVVField: (config?: unknown) => { render: (selector: string) => void }
        ExpiryField: (config?: unknown) => { render: (selector: string) => void }
        submit: (data?: unknown) => Promise<void>
      }
    }
  }
}

export function PayPalCheckout({
  amount,
  currency = "USD",
  onSuccess,
  onError,
}: PayPalCheckoutProps) {
  const [sdkReady, setSdkReady] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const buttonsRendered = useRef(false)
  const cardFieldsRendered = useRef(false)
  const cardFieldRef = useRef<ReturnType<NonNullable<typeof window.paypal>["CardFields"]> | null>(null)

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  async function createOrderCallback() {
    setResultMessage("")
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      })

      const orderData = await response.json()

      if (orderData.id) {
        return orderData.id
      } else {
        const errorDetail = orderData?.details?.[0]
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error(error)
      setResultMessage(`Could not initiate PayPal Checkout... ${error}`)
      throw error
    }
  }

  async function onApproveCallback(data: { orderID: string }) {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const orderData = await response.json()

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0]
      const errorDetail = orderData?.details?.[0]

      if (errorDetail || !transaction || transaction.status === "DECLINED") {
        let errorMessage
        if (transaction) {
          errorMessage = `Transaction ${transaction.status}: ${transaction.id}`
        } else if (errorDetail) {
          errorMessage = `${errorDetail.description} (${orderData.debug_id})`
        } else {
          errorMessage = JSON.stringify(orderData)
        }
        throw new Error(errorMessage)
      } else {
        setResultMessage(`Transaction ${transaction.status}: ${transaction.id}`)
        console.log("Capture result", orderData)
        onSuccess?.(orderData)
      }
    } catch (error) {
      console.error(error)
      setResultMessage(`Sorry, your transaction could not be processed... ${error}`)
      onError?.(error)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (!sdkReady || !window.paypal) return

    // Render PayPal Buttons
    if (!buttonsRendered.current) {
      buttonsRendered.current = true
      window.paypal
        .Buttons({
          createOrder: createOrderCallback,
          onApprove: onApproveCallback,
          onError: function (error: unknown) {
            console.error("PayPal Button Error:", error)
            setResultMessage(`PayPal Error: ${error}`)
            onError?.(error)
          },
          style: {
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          },
        })
        .render("#paypal-button-container")
    }

    // Render Card Fields
    if (!cardFieldsRendered.current) {
      cardFieldsRendered.current = true
      const cardField = window.paypal.CardFields({
        createOrder: createOrderCallback,
        onApprove: onApproveCallback,
        style: {
          input: {
            "font-size": "16px",
            "font-family": "courier, monospace",
            "font-weight": "lighter",
            color: "#333",
          },
          ".invalid": { color: "red" },
        },
      })

      if (cardField.isEligible()) {
        cardFieldRef.current = cardField

        cardField.NameField({
          style: { input: { color: "#333" }, ".invalid": { color: "red" } },
        }).render("#card-name-field-container")

        cardField.NumberField({
          style: { input: { color: "#333" } },
        }).render("#card-number-field-container")

        cardField.CVVField({
          style: { input: { color: "#333" } },
        }).render("#card-cvv-field-container")

        cardField.ExpiryField({
          style: { input: { color: "#333" } },
        }).render("#card-expiry-field-container")
      }
    }
  }, [sdkReady])

  const handleCardSubmit = async () => {
    if (!cardFieldRef.current) return

    setIsProcessing(true)
    try {
      await cardFieldRef.current.submit({
        billingAddress: {
          addressLine1: (document.getElementById("card-billing-address-line-1") as HTMLInputElement)?.value || "",
          addressLine2: (document.getElementById("card-billing-address-line-2") as HTMLInputElement)?.value || "",
          adminArea1: (document.getElementById("card-billing-address-admin-area-1") as HTMLInputElement)?.value || "",
          adminArea2: (document.getElementById("card-billing-address-admin-area-2") as HTMLInputElement)?.value || "",
          countryCode: (document.getElementById("card-billing-address-country-code") as HTMLInputElement)?.value || "US",
          postalCode: (document.getElementById("card-billing-address-postal-code") as HTMLInputElement)?.value || "",
        },
      })
    } catch (error) {
      console.error("Card submit error:", error)
      setResultMessage(`Card payment failed: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!clientId) {
    return <div className="text-red-500 text-center p-4">PayPal Client ID not configured</div>
  }

  return (
    <div className="w-full space-y-6">
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&components=buttons,card-fields&enable-funding=venmo&locale=en_US`}
        data-sdk-integration-source="developer-studio"
        onReady={() => setSdkReady(true)}
      />

      {/* Loading State */}
      {!sdkReady && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading payment options...</span>
        </div>
      )}

      {/* PayPal Buttons */}
      <div 
        id="paypal-button-container" 
        className={`min-h-[150px] ${!sdkReady ? 'hidden' : ''}`}
      />

      {/* Divider */}
      {sdkReady && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or pay with card</span>
          </div>
        </div>
      )}

      {/* Card Fields */}
      <div className={`border rounded-lg p-6 space-y-4 bg-card shadow-sm ${!sdkReady ? 'hidden' : ''}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Cardholder Name</label>
            <div 
              id="card-name-field-container" 
              className="h-11 border border-input rounded-md bg-background overflow-hidden"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Card Number</label>
            <div 
              id="card-number-field-container" 
              className="h-11 border border-input rounded-md bg-background overflow-hidden"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
              <div 
                id="card-expiry-field-container" 
                className="h-11 border border-input rounded-md bg-background overflow-hidden"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">CVV</label>
              <div 
                id="card-cvv-field-container" 
                className="h-11 border border-input rounded-md bg-background overflow-hidden"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-3 pt-4 border-t">
            <label className="block text-sm font-medium">Billing Address</label>
            <input
              type="text"
              id="card-billing-address-line-1"
              placeholder="Address line 1"
              className="w-full h-11 px-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <input
              type="text"
              id="card-billing-address-line-2"
              placeholder="Address line 2 (optional)"
              className="w-full h-11 px-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                id="card-billing-address-admin-area-2"
                placeholder="City"
                className="w-full h-11 px-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <input
                type="text"
                id="card-billing-address-admin-area-1"
                placeholder="State/Province"
                className="w-full h-11 px-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                id="card-billing-address-country-code"
                placeholder="Country (e.g. US)"
                defaultValue="US"
                className="w-full h-11 px-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <input
                type="text"
                id="card-billing-address-postal-code"
                placeholder="Postal code"
                className="w-full h-11 px-3 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>

          <button
            onClick={handleCardSubmit}
            disabled={isProcessing}
            className="w-full h-12 mt-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Processing...
              </span>
            ) : (
              `Pay $${amount} with Card`
            )}
          </button>
        </div>
      </div>

      {/* Result Message */}
      {resultMessage && (
        <div className={`p-4 rounded-md text-sm ${
          resultMessage.includes("error") || resultMessage.includes("Sorry") || resultMessage.includes("failed")
            ? "bg-destructive/10 text-destructive border border-destructive/20" 
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {resultMessage}
        </div>
      )}
    </div>
  )
}
