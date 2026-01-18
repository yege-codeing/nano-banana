"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { CreemCheckout } from "@creem_io/nextjs"  // 已注释：改用 PayPal 支付
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    priceValue: "0",
    period: "/month",
    description: "Perfect for trying out Nano Banana",
    features: [
      "5 image generations per day",
      "Basic editing features",
      "Standard quality output",
      "Community support",
    ],
    isPaid: false,
    popular: false,
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "$19",
    priceValue: "19.00",
    period: "/month",
    description: "For creators who need more power",
    features: [
      "100 image generations per day",
      "Advanced editing features",
      "High quality output",
      "Priority support",
      "No watermarks",
      "Commercial license",
    ],
    isPaid: true,
    popular: true,
    buttonText: "Subscribe Now",
  },
  {
    name: "Enterprise",
    price: "$99",
    priceValue: "99.00",
    period: "/month",
    description: "For teams and businesses",
    features: [
      "Unlimited generations",
      "All Pro features",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Team management",
      "SLA guarantee",
    ],
    isPaid: true,
    popular: false,
    buttonText: "Contact Sales",
  },
]

export default function PricingPage() {
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#showcase" className="text-sm hover:text-primary transition-colors">
                Showcase
              </Link>
              <Link href="/pricing" className="text-sm text-primary font-medium">
                Pricing
              </Link>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-1">
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.isPaid ? (
                    // PayPal 支付 - 跳转到结账页面
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      asChild
                    >
                      <Link href={`/pricing/checkout?plan=${plan.name}&amount=${plan.priceValue}`}>
                        {plan.buttonText}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      size="lg"
                      asChild
                    >
                      <Link href="/">{plan.buttonText}</Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ for pricing */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, debit cards, PayPal, and Venmo through our secure payment provider PayPal.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Our Free plan lets you try Nano Banana with limited features. No credit card required to get started!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍌</span>
              <span className="text-xl font-bold">Nano Banana</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2026 Nano Banana. Transform images with AI-powered editing.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
