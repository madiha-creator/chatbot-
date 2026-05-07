'use client'

import React, { useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  onStop?: () => void
}

export function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [value, setValueState] = React.useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <div
        className={cn(
          'flex items-end gap-2 rounded-2xl border-[2.5px] transition-all duration-200',
          isDark
            ? 'bg-[#1e1e35] border-purple-700 focus-within:border-purple-500'
            : 'bg-white border-gray-200 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20',
          isLoading && (isDark ? 'border-purple-500' : 'border-purple-300')
        )}
        style={{ boxShadow: isDark ? '3px 3px 0 #7c3aed' : '3px 3px 0 #1a1a2e' }}
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
            'flex-1 resize-none bg-transparent px-4 py-3 text-sm focus:outline-none disabled:opacity-60 max-h-[200px] overflow-y-auto',
            isDark ? 'text-gray-100 placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'
          )}
        />
        <div className="flex items-center gap-1 pr-2 pb-2">
          {isLoading ? (
            <button
              onClick={onStop}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors border-2 border-gray-900"
              style={{ boxShadow: '2px 2px 0 #1a1a2e' }}
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!value.trim()}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 border-2',
                value.trim()
                  ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white border-gray-900 shadow-[2px_2px_0_#1a1a2e]'
                  : isDark
                    ? 'bg-white/5 text-gray-600 border-transparent cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'
              )}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className={cn('text-center text-xs mt-2', isDark ? 'text-gray-600' : 'text-gray-400')}>
        AI can make mistakes. Verify important information.
      </p>
    </div>
  )
}
