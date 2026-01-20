import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "Nano Banana - AI Image Editor | Edit Photos with Text",
    template: "%s | Nano Banana"
  },
  description:
    "Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character editing and scene preservation.",
  keywords: ["AI image editor", "photo editing", "text to image", "AI editing", "image transformation", "Nano Banana"],
  authors: [{ name: "Nano Banana" }],
  creator: "Nano Banana",
  publisher: "Nano Banana",
  generator: "v0.app",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Nano Banana",
    title: "Nano Banana - AI Image Editor | Edit Photos with Text",
    description: "Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character editing and scene preservation.",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "Nano Banana - AI Image Editor"
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana - AI Image Editor | Edit Photos with Text",
    description: "Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character editing and scene preservation.",
    images: ["/icon.svg"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
