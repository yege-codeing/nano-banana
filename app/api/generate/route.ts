import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 })
  }

  const { getUserCredits } = await import('@/lib/credits/get-user-credits')
  const { consumeCredits } = await import('@/lib/credits/consume-credits')

  const { data: credits } = await getUserCredits(user.id)
  if (!credits || credits.total_credits < 1) {
    return NextResponse.json(
      { error: 'insufficient_credits', remaining: credits?.total_credits || 0 },
      { status: 402 }
    )
  }

  const consumeResult = await consumeCredits(user.id, 1)
  if (!consumeResult.success) {
    return NextResponse.json(
      { error: 'insufficient_credits', remaining: consumeResult.remaining },
      { status: 402 }
    )
  }

  try {
    const { prompt, references, model = "google/gemini-3-pro-image-preview" } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const referenceImages: string[] = Array.isArray(references)
      ? references.filter((item) => typeof item === "string").slice(0, 3)
      : []

    const messageContent: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string; detail?: "high" | "low" } }
    > = [{ type: "text", text: prompt }]

    referenceImages.forEach((url) => {
      messageContent.push({ type: "image_url", image_url: { url, detail: "high" } })
    })

    const apiResponse = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: messageContent as any,
        },
      ],
      modalities: ["image", "text"] as any,
    } as any)

    const response: any = apiResponse.choices[0]?.message

    const images = response?.images?.map((img: any) => img.image_url?.url).filter(Boolean) ?? []
    const text = response?.content ?? ""

    if (!images.length) {
      return NextResponse.json(
        { error: "No images returned from model", text },
        {
          status: 502,
        }
      )
    }

    return NextResponse.json({ images, text })
  } catch (error: any) {
    console.error("Generation error", error)
    return NextResponse.json(
      { error: error?.message || "Failed to generate image" },
      {
        status: 500,
      }
    )
  }
}
