"use client"

import { Upload, Sparkles, Zap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GeneratorDemo } from "@/components/generator-demo"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🍌</span>
              <span className="text-xl font-bold">Nano Banana</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </a>
              <a href="#showcase" className="text-sm hover:text-primary transition-colors">
                Showcase
              </a>
              <a href="#reviews" className="text-sm hover:text-primary transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-sm hover:text-primary transition-colors">
                FAQ
              </a>
              <Button>Get Started</Button>
            </nav>
            <Button className="md:hidden">Menu</Button>
          </div>
        </div>
      </header>

      {/* Banana decorations */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none hidden lg:block">
        <span className="text-8xl">🍌</span>
      </div>
      <div className="fixed bottom-20 left-10 opacity-20 pointer-events-none hidden lg:block rotate-45">
        <span className="text-6xl">🍌</span>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 mb-6">
              <span className="text-lg">🍌</span>
              <span className="text-sm font-medium">The AI model that outperforms Flux Kontext</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">Nano Banana</h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-3xl mx-auto">
              Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
              editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-base">
                <Upload className="mr-2 h-5 w-5" />
                Start Editing
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                View Examples
              </Button>
            </div>

            {/* Middle Generator UI */}
            <div className="mt-10">
              <GeneratorDemo />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>One-shot editing</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Multi-image support</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Natural language</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nano-banana is the most advanced AI image editor on LMArena. Revolutionize your photo editing with natural
              language understanding
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🗣️",
                title: "Natural Language Editing",
                description:
                  "Edit images using simple text prompts. Nano-banana AI understands complex instructions like GPT for images",
              },
              {
                icon: "👤",
                title: "Character Consistency",
                description:
                  "Maintain perfect character details across edits. This model excels at preserving faces and identities",
              },
              {
                icon: "🎨",
                title: "Scene Preservation",
                description:
                  "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
              },
              {
                icon: "⚡",
                title: "One-Shot Editing",
                description:
                  "Perfect results in a single attempt. Nano-banana solves one-shot image editing challenges effortlessly",
              },
              {
                icon: "🖼️",
                title: "Multi-Image Context",
                description:
                  "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
              },
              {
                icon: "📱",
                title: "AI UGC Creation",
                description:
                  "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lightning-Fast AI Creations</h2>
            <p className="text-lg text-muted-foreground">See what Nano Banana generates in milliseconds</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                image: "/mountain-sunset-vista.png",
                badge: "Nano Banana Speed",
                title: "Ultra-Fast Mountain Generation",
                description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
              },
              {
                image: "/beautiful-garden-flowers.jpg",
                badge: "Nano Banana Speed",
                title: "Instant Garden Creation",
                description: "Complex scene rendered in milliseconds using Nano Banana technology",
              },
              {
                image: "/tropical-beach-paradise.png",
                badge: "Nano Banana Speed",
                title: "Real-time Beach Synthesis",
                description: "Nano Banana delivers photorealistic results at lightning speed",
              },
              {
                image: "/northern-lights-aurora.png",
                badge: "Nano Banana Speed",
                title: "Rapid Aurora Generation",
                description: "Advanced effects processed instantly with Nano Banana AI",
              },
            ].map((showcase, i) => (
              <Card key={i} className="overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={showcase.image || "/placeholder.svg"}
                    alt={showcase.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {showcase.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{showcase.title}</h3>
                  <p className="text-muted-foreground">{showcase.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg">Experience the power of Nano Banana yourself</Button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">User Reviews</h2>
            <p className="text-lg text-muted-foreground">What creators are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "AIArtistPro",
                role: "Digital Creator",
                review:
                  "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
              },
              {
                name: "ContentCreator",
                role: "UGC Specialist",
                review:
                  "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
              },
              {
                name: "PhotoEditor",
                role: "Professional Editor",
                review:
                  "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
              },
            ].map((review, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-2xl">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">&ldquo;{review.review}&rdquo;</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQs</h2>
            <p className="text-lg text-muted-foreground">Frequently Asked Questions</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">What is Nano Banana?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  It's a revolutionary AI image editing model that transforms photos using natural language prompts.
                  This is currently the most powerful image editing model available, with exceptional consistency. It
                  offers superior performance compared to Flux Kontext for consistent character editing and scene
                  preservation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">How does it work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Simply upload an image and describe your desired edits in natural language. The AI understands complex
                  instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it".
                  It processes your text prompt and generates perfectly edited images.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">How is it better than Flux Kontext?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  This model excels in character consistency, scene blending, and one-shot editing. Users report it
                  "completely destroys" Flux Kontext in preserving facial features and seamlessly integrating edits with
                  backgrounds. It also supports multi-image context, making it ideal for creating consistent AI
                  influencers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">Can I use it for commercial projects?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many
                  users leverage it for creating consistent AI influencers and product photography. The high-quality
                  outputs are suitable for professional use.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">What types of edits can it handle?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The editor handles complex edits including face completion, background changes, object placement,
                  style transfers, and character modifications. It excels at understanding contextual instructions like
                  "place in a blizzard" or "create the whole face" while maintaining photorealistic quality.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">Where can I try Nano Banana?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You can try nano-banana on LMArena or through our web interface. Simply upload your image, enter a
                  text prompt describing your desired edits, and watch as nano-banana AI transforms your photo with
                  incredible accuracy and consistency.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
