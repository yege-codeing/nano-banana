"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing to Nano Banana
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your subscription is now active. You can start using all the premium features right away.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/">Start Creating</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">View Your Plan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
