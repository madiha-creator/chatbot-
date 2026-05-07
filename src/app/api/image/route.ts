import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Use Pollinations.AI — free, no API key needed, reliable image generation
    const encoded = encodeURIComponent(prompt)
    const seed = Math.floor(Math.random() * 1000000)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`

    // Verify the image is reachable
    const check = await fetch(url, { method: 'HEAD' })
    if (!check.ok) {
      return Response.json({ error: 'Image generation service unavailable' }, { status: 502 })
    }

    return Response.json({ url })
  } catch (error) {
    console.error('Image route error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
