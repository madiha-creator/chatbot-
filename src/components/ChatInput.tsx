'use client'

import React, { useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  onStop?: () => void
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [value, setValueState] = React.useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValueState('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <div
        className={cn(
          'flex items-end gap-2 rounded-2xl border bg-white shadow-sm transition-all duration-200',
          'focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-400',
          isLoading ? 'border-purple-300' : 'border-gray-200'
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValueState(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Made ChatBot… (Shift+Enter for new line)"
          rows={1}
          disabled={isLoading}
          className={cn(
            'flex-1 resize-none bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400',
            'focus:outline-none disabled:opacity-60',
            'max-h-[200px] overflow-y-auto'
          )}
        />

        <div className="flex items-center gap-1 pr-2 pb-2">
          {isLoading ? (
            <button
              onClick={onStop}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              title="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!value.trim()}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
                value.trim()
                  ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-md shadow-purple-500/25'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
              title="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  )
}
