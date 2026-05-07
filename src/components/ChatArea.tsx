'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PanelLeft, Sparkles } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store/chatStore'
import { useTheme } from '@/context/ThemeContext'
import { MessageBubble } from '@/components/MessageBubble'
import { ChatInput } from '@/components/ChatInput'
import { ModelSelector } from '@/components/ModelSelector'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  { emoji: '🔭', text: 'Explain quantum computing in simple terms' },
  { emoji: '🐍', text: 'Write a Python function to sort a list' },
  { emoji: '🌐', text: 'What are the best practices for REST APIs?' },
  { emoji: '🐛', text: 'Help me debug this JavaScript error' },
]

interface ChatAreaProps {
  initialPrompt?: string
  onInitialPromptUsed?: () => void
}

export function ChatArea({ initialPrompt, onInitialPromptUsed }: ChatAreaProps) {
  const { currentConversation, isLoading, sendMessage, regenerateLastResponse } = useChat()
  const { sidebarOpen, toggleSidebar } = useChatStore()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const bottomRef = useRef<HTMLDivElement>(null)
  const sentRef = useRef(false)

  useEffect(() => {
    if (initialPrompt && !sentRef.current) {
      sentRef.current = true
      sendMessage(initialPrompt)
      onInitialPromptUsed?.()
    }
  }, [initialPrompt])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages])

  const messages = currentConversation?.messages ?? []
  const isEmpty = messages.length === 0

  return (
    <div className={cn('flex flex-col flex-1 min-w-0 h-full transition-colors duration-200', isDark ? 'bg-[#0f0f1a]' : 'comic-bg')}>
      {/* Top bar */}
      <div
        className={cn('flex items-center justify-between px-4 py-3 border-b-[2.5px] shrink-0 transition-colors duration-200', isDark ? 'bg-[#13132a] border-purple-700' : 'bg-white border-gray-900')}
        style={{ boxShadow: isDark ? '0 3px 0 #7c3aed' : '0 3px 0 #1a1a2e' }}
      >
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className={cn('rounded-lg p-1.5 transition-colors border', isDark ? 'text-gray-400 hover:bg-white/5 border-purple-700' : 'text-gray-500 hover:bg-gray-100 border-gray-200')}
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className={cn('font-bangers text-lg tracking-wide truncate', isDark ? 'text-purple-300' : 'text-gray-900')}>
            {currentConversation?.title ?? 'New Chat'}
          </h1>
        </div>
        <ModelSelector />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4 py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center border-[2.5px]"
                style={{ borderColor: isDark ? '#7c3aed' : '#1a1a2e', boxShadow: `4px 4px 0 ${isDark ? '#7c3aed' : '#1a1a2e'}` }}
              >
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className={cn('font-bangers text-3xl tracking-wide', isDark ? 'text-purple-300' : 'text-gray-900')}>
                  How can I help you?
                </h2>
                <p className={cn('text-sm mt-1', isDark ? 'text-gray-500' : 'text-gray-500')}>
                  Start a conversation or pick a suggestion below
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => sendMessage(s.text)}
                  className={cn(
                    'text-left rounded-xl border-[2.5px] px-4 py-3 text-sm flex items-start gap-2 transition-all duration-150',
                    isDark
                      ? 'bg-[#1a1a2e] border-purple-700 text-gray-300 hover:border-purple-500 hover:bg-purple-900/20'
                      : 'bg-white border-gray-900 text-gray-700 hover:bg-purple-50',
                    'shadow-[3px_3px_0_var(--border)]'
                  )}
                  style={{ boxShadow: `3px 3px 0 ${isDark ? '#7c3aed' : '#1a1a2e'}` }}
                >
                  <span className="text-lg leading-none">{s.emoji}</span>
                  <span>{s.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-1">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLast={i === messages.length - 1}
                onRegenerate={
                  msg.role === 'assistant' && i === messages.length - 1
                    ? regenerateLastResponse
                    : undefined
                }
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={cn('shrink-0 border-t-[2.5px] transition-colors duration-200', isDark ? 'bg-[#13132a] border-purple-700' : 'bg-white border-gray-900')}>
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
