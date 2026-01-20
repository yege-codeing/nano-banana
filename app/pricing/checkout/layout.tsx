import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Secure Checkout - Complete Your Purchase",
  description: "Complete your Nano Banana subscription securely with PayPal. Choose from Pro or Enterprise plans with flexible monthly billing.",
  alternates: {
    canonical: '/pricing/checkout',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Secure Checkout | Nano Banana",
    description: "Complete your Nano Banana subscription securely.",
    url: '/pricing/checkout',
    type: 'website',
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
