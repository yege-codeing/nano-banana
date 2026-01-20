import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Payment Successful - Welcome to Nano Banana",
  description: "Your subscription is now active. Start creating amazing AI-edited images with Nano Banana's advanced features.",
  alternates: {
    canonical: '/pricing/success',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Payment Successful | Nano Banana",
    description: "Your subscription is now active.",
    url: '/pricing/success',
    type: 'website',
  },
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
