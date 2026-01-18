"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Copy, ImageIcon, Loader2, Plus, Sparkles, Trash } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { CreditsDisplay } from "@/components/credits-display"

type Mode = "image-to-image" | "text-to-image"

type GeneratedImage = {
  id: string
  src: string
  prompt: string
  model: string
  mode: Mode
  referenceCount: number
}

const SAMPLE_LIBRARY = [
  "/mountain-sunset-vista.png",
  "/beautiful-garden-flowers.jpg",
  "/tropical-beach-paradise.png",
  "/northern-lights-aurora.png",
]

export function GeneratorDemo() {
  const { toast } = useToast()
  const [mode, setMode] = useState<Mode>("image-to-image")
  const [model, setModel] = useState("nano-banana")
  const [batchEnabled, setBatchEnabled] = useState(false)
  const [referenceImages, setReferenceImages] = useState<string[]>([])
  const [prompt, setPrompt] = useState(
    "A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
  )
  const [outputs, setOutputs] = useState<GeneratedImage[]>([])
  const [generating, setGenerating] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const referenceCount = referenceImages.length
  const canGenerate = prompt.trim().length > 4 && !generating && !!user

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      toast({ title: "登录失败", description: error.message })
    }
  }

  const handleCopyPrompt = async () => {
    if (typeof window === "undefined") return
    
    try {
      await navigator.clipboard.writeText(prompt)
      toast({ title: "Prompt copied" })
    } catch {
      toast({ title: "Copy failed", description: "Clipboard access is blocked in this context." })
    }
  }

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = Math.max(0, 9 - referenceImages.length)
    if (remaining === 0) {
      toast({ title: "Reference limit reached", description: "You can add up to 9 images." })
      return
    }

    const selected = files.slice(0, remaining)
    try {
      const results = await Promise.all(selected.map((file) => readFileAsDataUrl(file)))
      setReferenceImages((prev) => [...prev, ...results])
      toast({ title: `Added ${results.length} reference image${results.length > 1 ? "s" : ""}` })
    } catch {
      toast({ title: "Upload failed", description: "Please try a different image." })
    }
  }

  const handleAddFromLibrary = () => {
    if (referenceImages.length >= 9) {
      toast({ title: "Reference limit reached", description: "You can add up to 9 images." })
      return
    }
    const next = SAMPLE_LIBRARY[referenceImages.length % SAMPLE_LIBRARY.length]
    setReferenceImages((prev) => [...prev, next])
  }

  const removeReference = (idx: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const runGeneration = async () => {
    setGenerating(true)
    try {
      const payload = {
        prompt: prompt.trim(),
        references: mode === "image-to-image" ? referenceImages : [],
        model: "google/gemini-3-pro-image-preview",
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.status === 402) {
        const err = await res.json()
        toast({
          title: "积分不足",
          description: "您需要积分来生成图片。订阅即可获得 100 个积分！",
          action: (
            <Button onClick={() => window.location.href = '/pricing'}>
              立即订阅
            </Button>
          )
        })
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Generation failed")
      }

      const data: { images: string[]; text?: string } = await res.json()

      const newImages: GeneratedImage[] = data.images.map((src, idx) => ({
        id: `${Date.now()}-${idx}`,
        src,
        prompt: payload.prompt,
        model: payload.model,
        mode,
        referenceCount,
      }))

      if (!newImages.length) throw new Error("Model returned no images")

      setOutputs((prev) => [...newImages, ...prev].slice(0, batchEnabled ? 12 : 6))
      toast({
        title: "Images generated",
        description: `${newImages.length} result${newImages.length > 1 ? "s" : ""} added to gallery`,
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Generation failed",
        description: error?.message ?? "Unexpected error",
      })
    } finally {
      setGenerating(false)
    }
  }

  const hasOutput = outputs.length > 0
  const galleryColumns = useMemo(() => (outputs.length >= 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"), [outputs.length])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/20 bg-gradient-to-b from-background to-accent/25 shadow-[0_10px_30px_-20px_hsl(var(--primary))]">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-semibold leading-none">Prompt Engine</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Transform your image with AI-powered editing
                </p>
              </div>
              {user && <CreditsDisplay />}
            </div>

            <div className="mt-5">
              <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <TabsList className="grid w-full grid-cols-2 rounded-xl bg-accent/40 p-1">
                  <TabsTrigger value="image-to-image" className="rounded-lg">
                    Image to Image
                  </TabsTrigger>
                  <TabsTrigger value="text-to-image" className="rounded-lg">
                    Text to Image
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-primary">✨</span>
                  <Label className="text-sm font-medium">AI Model Selection</Label>
                </div>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="h-11 rounded-xl bg-background/70">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nano-banana">Nano Banana</SelectItem>
                    <SelectItem value="nano-banana-pro">Nano Banana Pro</SelectItem>
                    <SelectItem value="nano-banana-fast">Nano Banana Fast</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Different models offer unique characteristics and styles
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border bg-background/50 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Batch Processing</p>
                    <Badge className="h-5 rounded-md bg-primary/10 px-2 text-[11px] font-medium text-primary">
                      Pro
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enable batch mode to process multiple images at once
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 rounded-lg px-3"
                    onClick={() => {
                      setBatchEnabled(true)
                      toast({ title: "Pro batch unlocked (demo)", description: "Simulating batch up to 3 outputs." })
                    }}
                  >
                    Upgrade
                  </Button>
                  <Switch checked={batchEnabled} onCheckedChange={setBatchEnabled} />
                </div>
              </div>

              {mode === "image-to-image" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Reference Image</Label>
                      <span className="text-xs text-muted-foreground">{referenceCount}/9</span>
                    </div>
                    <Button size="sm" variant="secondary" className="h-8 rounded-lg px-3" onClick={handleAddFromLibrary}>
                      Select from Library
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="group flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-background/40 p-5 text-center transition-colors hover:border-primary/40">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Plus className="h-6 w-6" />
                      </div>
                      <p className="mt-3 text-sm font-medium">Add Image</p>
                      <p className="text-xs text-muted-foreground">Max 10MB • up to 9</p>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>

                    {referenceImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                        {referenceImages.map((img, i) => (
                          <div key={`${img}-${i}`} className="group relative overflow-hidden rounded-xl border bg-background/50">
                            <img src={img} alt={`Reference ${i + 1}`} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeReference(i)}
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border bg-background/40 p-3 text-xs text-muted-foreground">
                        Tip: add up to 9 reference images to guide the edit. You can also pick from the library.
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-medium">Main Prompt</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-lg px-2"
                    onClick={handleCopyPrompt}
                    disabled={!prompt.trim()}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none rounded-xl bg-background/70"
                  placeholder="Describe what you want to create..."
                />
              </div>

              <div className="rounded-xl border bg-accent/20 p-4 text-sm text-muted-foreground">
                Want more powerful image generation features?{" "}
                <button type="button" className="font-medium text-primary hover:underline">
                  Visit Full Generator →
                </button>
              </div>

              <Button
                size="lg"
                className="h-12 w-full rounded-xl"
                disabled={user ? !canGenerate : false}
                onClick={user ? runGeneration : handleSignIn}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Now"
                )}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-b from-background to-accent/10 shadow-[0_10px_30px_-20px_hsl(var(--primary))]">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold leading-none">Output Gallery</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your ultra-fast AI creations appear here instantly
                </p>
              </div>
            </div>

            <div className="mt-6">
              {hasOutput ? (
                <div className={`grid gap-4 ${galleryColumns}`}>
                  {outputs.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-xl border bg-background/50 shadow-sm">
                      <img src={item.src} alt={item.prompt} className="h-56 w-full object-cover" />
                      <div className="space-y-1 p-3 text-sm">
                        <p className="line-clamp-2 font-medium">{item.prompt || "Untitled prompt"}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.model} • {item.mode === "image-to-image" ? `${item.referenceCount} ref` : "text only"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center rounded-xl border-2 border-dashed border-primary/15 bg-background/40 p-6">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <ImageIcon className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p className="mt-5 font-medium">Ready for instant generation</p>
                    <p className="mt-2 text-sm text-muted-foreground">Enter your prompt and unleash the power</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
