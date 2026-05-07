import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Use OpenRouter with a text-to-image model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Made ChatBot',
      },
      body: JSON.stringify({
        model: 'openai/dall-e-3',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Image API error:', response.status, err)
      return Response.json({ error: `Image generation failed: ${err}` }, { status: response.status })
    }

    const data = await response.json()

    // DALL-E via OpenRouter returns image URL in content
    const content = data.choices?.[0]?.message?.content
    // Try to extract URL from markdown or plain text
    const urlMatch = content?.match(/https?:\/\/[^\s\)\"]+/)
    const url = urlMatch?.[0] || content

    if (!url) {
      return Response.json({ error: 'No image URL returned' }, { status: 500 })
    }

    return Response.json({ url })
  } catch (error) {
    console.error('Image route error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
