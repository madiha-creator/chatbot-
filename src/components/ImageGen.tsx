'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Download, RefreshCw, ImageIcon, Sparkles, Loader2 } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
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
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const fullPrompt = `${prompt}, ${selectedStyle.value}`

  const generate = async (overridePrompt?: string) => {
    const p = overridePrompt ?? prompt
    if (!p.trim() || isLoading) return
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${p}, ${selectedStyle.value}` }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate image')
        return
      }

      setImages((prev) => [{ url: data.url, prompt: p, style: selectedStyle.label }, ...prev])
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate() }
  }

  const border = isDark ? '#7c3aed' : '#1a1a2e'
  const shadow = isDark ? '0 3px 0 #7c3aed' : '0 3px 0 #1a1a2e'

  return (
    <div className={cn('flex flex-col flex-1 min-w-0 h-full overflow-hidden transition-colors duration-200', isDark ? 'bg-[#0f0f1a]' : 'comic-bg')}>
      {/* Header */}
      <div
        className={cn('border-b-[2.5px] px-6 py-4 transition-colors', isDark ? 'bg-[#13132a] border-purple-600' : 'bg-white border-gray-900')}
        style={{ boxShadow: shadow }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center border-2" style={{ borderColor: border, boxShadow: `2px 2px 0 ${border}` }}>
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className={cn('font-bangers text-2xl tracking-wide', isDark ? 'text-purple-300' : 'text-gray-900')}>Image Generator</h1>
            <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-500')}>Free AI image generation • No credits needed</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Prompt input card */}
        <div className={cn('rounded-2xl border-[2.5px] p-5 transition-colors', isDark ? 'bg-[#1a1a2e] border-purple-700' : 'bg-white border-gray-900')} style={{ boxShadow: `4px 4px 0 ${border}` }}>
          <label className={cn('font-bangers text-lg tracking-wide mb-3 block', isDark ? 'text-purple-300' : 'text-gray-900')}>✨ Describe Your Image</label>

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
                    : isDark
                      ? 'bg-white/5 text-gray-400 border-purple-800 hover:border-purple-500 hover:text-purple-300'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                )}
              >
                {style.label}
              </button>
            ))}
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="A magical castle floating in the clouds..."
            rows={3}
            className={cn(
              'w-full resize-none rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-all',
              isDark ? 'bg-[#0f0f1a] border-purple-800 text-gray-200 placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-800 placeholder:text-gray-400'
            )}
          />

          <div className="flex items-center justify-between mt-3">
            <p className={cn('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
              Style: <span className="text-purple-500 font-medium">{selectedStyle.label}</span>
            </p>
            <button
              onClick={() => generate()}
              disabled={!prompt.trim() || isLoading}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2',
                prompt.trim() && !isLoading
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border-gray-900 shadow-[3px_3px_0_#1a1a2e] hover:-translate-x-0.5 hover:-translate-y-0.5'
                  : isDark
                    ? 'bg-white/5 text-gray-600 border-transparent cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              )}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Example prompts */}
        {images.length === 0 && !isLoading && (
          <div className={cn('rounded-2xl border-[2.5px] p-5 transition-colors', isDark ? 'bg-[#1a1a2e] border-purple-700' : 'bg-white border-gray-900')} style={{ boxShadow: `4px 4px 0 ${border}` }}>
            <p className={cn('font-bangers text-lg tracking-wide mb-3', isDark ? 'text-purple-300' : 'text-gray-900')}>💡 Try These Ideas</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <motion.button
                  key={p}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setPrompt(p); generate(p) }}
                  className={cn(
                    'text-left rounded-xl border-2 px-4 py-3 text-sm transition-all',
                    isDark
                      ? 'bg-purple-900/20 text-gray-300 border-purple-800 hover:border-purple-500'
                      : 'bg-purple-50 text-gray-700 border-gray-200 hover:border-purple-400 hover:bg-purple-100'
                  )}
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
          <div className="rounded-2xl border-2 border-red-400 p-4 bg-red-50" style={{ boxShadow: '3px 3px 0 #f87171' }}>
            <p className="text-sm text-red-600 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className={cn('rounded-2xl border-[2.5px] p-4', isDark ? 'bg-[#1a1a2e] border-purple-700' : 'bg-white border-gray-900')} style={{ boxShadow: `4px 4px 0 ${border}` }}>
            <div className="shimmer rounded-xl h-64 w-full" />
            <p className="text-center text-sm text-purple-500 font-semibold mt-3 animate-pulse">🎨 Creating your masterpiece...</p>
          </div>
        )}

        {/* Generated images */}
        <AnimatePresence>
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('rounded-2xl border-[2.5px] overflow-hidden', isDark ? 'bg-[#1a1a2e] border-purple-700' : 'bg-white border-gray-900')}
              style={{ boxShadow: `4px 4px 0 ${border}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.prompt} className="w-full object-cover" loading="lazy" />
              <div className="p-4 flex items-start justify-between gap-3">
                <div>
                  <p className={cn('text-sm font-semibold', isDark ? 'text-gray-200' : 'text-gray-800')}>{img.prompt}</p>
                  <p className="text-xs text-purple-500 mt-0.5">{img.style}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={img.url}
                    download="generated-image.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white border-2 border-gray-900 shadow-[2px_2px_0_#1a1a2e] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Save
                  </a>
                  <button
                    onClick={() => generate(img.prompt)}
                    className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5', isDark ? 'bg-white/5 text-gray-300 border-purple-700 shadow-[2px_2px_0_#7c3aed]' : 'bg-white text-gray-700 border-gray-300 shadow-[2px_2px_0_#1a1a2e]')}
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
