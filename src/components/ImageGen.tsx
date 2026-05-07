'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Download, RefreshCw, ImageIcon, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STYLE_PRESETS = [
  { label: '🎨 Cartoon', value: 'cartoon style, vibrant colors, bold outlines' },
  { label: '🖼️ Realistic', value: 'photorealistic, highly detailed, 8k' },
  { label: '🌸 Anime', value: 'anime style, studio ghibli inspired' },
  { label: '🎭 Oil Paint', value: 'oil painting, impressionist style' },
  { label: '🤖 Cyberpunk', value: 'cyberpunk, neon lights, futuristic' },
  { label: '✏️ Sketch', value: 'pencil sketch, hand drawn, black and white' },
]

const EXAMPLE_PROMPTS = [
  'A magical forest with glowing mushrooms at night',
  'A cute robot reading a book in a cozy library',
  'A dragon flying over a medieval castle at sunset',
  'An astronaut surfing on Saturn\'s rings',
]

interface GeneratedImage {
  url: string
  prompt: string
  style: string
}

export function ImageGen() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [error, setError] = useState('')

  const fullPrompt = `${prompt}, ${selectedStyle.value}`

  const generate = async () => {
    if (!prompt.trim() || isLoading) return
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate image')
        return
      }

      setImages((prev) => [{ url: data.url, prompt, style: selectedStyle.label }, ...prev])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate() }
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full comic-bg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b-[2.5px] border-gray-900 px-6 py-4" style={{ boxShadow: '0 3px 0 #1a1a2e' }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center border-2 border-gray-900" style={{ boxShadow: '2px 2px 0 #1a1a2e' }}>
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bangers text-2xl text-gray-900 tracking-wide">Image Generator</h1>
            <p className="text-xs text-gray-500">Powered by AI • Create stunning visuals</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Prompt input card */}
        <div className="comic-card p-5">
          <label className="font-bangers text-lg text-gray-900 tracking-wide mb-3 block">✨ Describe Your Image</label>

          {/* Style presets */}
          <div className="flex flex-wrap gap-2 mb-3">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.label}
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all duration-150',
                  selectedStyle.label === style.label
                    ? 'bg-purple-600 text-white border-gray-900 shadow-[2px_2px_0_#1a1a2e]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                )}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="A magical castle floating in the clouds..."
              rows={3}
              className="flex-1 resize-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">Style: <span className="text-purple-600 font-medium">{selectedStyle.label}</span></p>
            <button
              onClick={generate}
              disabled={!prompt.trim() || isLoading}
              className={cn(
                'comic-btn flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                prompt.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-gray-900'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none'
              )}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Example prompts */}
        {images.length === 0 && !isLoading && (
          <div className="comic-card p-5">
            <p className="font-bangers text-lg text-gray-900 tracking-wide mb-3">💡 Try These Ideas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPrompt(p)}
                  className="text-left rounded-xl border-2 border-gray-200 bg-purple-50 px-4 py-3 text-sm text-gray-700 hover:border-purple-400 hover:bg-purple-100 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5 text-purple-400 inline mr-1.5" />
                  {p}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="comic-card border-red-400 p-4 bg-red-50" style={{ boxShadow: '3px 3px 0 #f87171' }}>
            <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="comic-card p-4">
            <div className="shimmer rounded-xl h-64 w-full" />
            <p className="text-center text-sm text-purple-600 font-semibold mt-3 animate-pulse">🎨 Creating your masterpiece...</p>
          </div>
        )}

        {/* Generated images */}
        <AnimatePresence>
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="comic-card overflow-hidden"
            >
              <img src={img.url} alt={img.prompt} className="w-full object-cover" />
              <div className="p-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{img.prompt}</p>
                  <p className="text-xs text-purple-500 mt-0.5">{img.style}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={img.url}
                    download="generated-image.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="comic-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white border-gray-900"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Save
                  </a>
                  <button
                    onClick={() => { setPrompt(img.prompt); generate() }}
                    className="comic-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-700 border-gray-300"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Redo
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
