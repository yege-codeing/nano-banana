import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Pricing Plans - Affordable AI Image Editing",
  description: "Choose the perfect plan for your needs. Free, Pro, and Enterprise options available. Upgrade or downgrade anytime with flexible monthly billing.",
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: "Pricing Plans - Affordable AI Image Editing | Nano Banana",
    description: "Choose the perfect plan for your needs. Free, Pro ($19/mo), and Enterprise ($99/mo) options available.",
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Pricing Plans - Affordable AI Image Editing | Nano Banana",
    description: "Choose the perfect plan for your needs. Free, Pro ($19/mo), and Enterprise ($99/mo) options available.",
  }
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
