'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PanelLeft, Sparkles } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store/chatStore'
import { MessageBubble } from '@/components/MessageBubble'
import { ChatInput } from '@/components/ChatInput'
import { ModelSelector } from '@/components/ModelSelector'

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
  const bottomRef = useRef<HTMLDivElement>(null)
  const sentRef = useRef(false)

  // Auto-send prompt coming from Explore
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
    <div className="flex flex-col flex-1 min-w-0 h-full comic-bg">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[2.5px] border-gray-900 bg-white shrink-0" style={{ boxShadow: '0 3px 0 #1a1a2e' }}>
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
              title="Open sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className="font-bangers text-lg text-gray-900 tracking-wide truncate">
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
                className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center border-[2.5px] border-gray-900"
                style={{ boxShadow: '4px 4px 0 #1a1a2e' }}
              >
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-bangers text-3xl text-gray-900 tracking-wide">How can I help you?</h2>
                <p className="text-sm text-gray-500 mt-1">Start a conversation or pick a suggestion below</p>
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
                  className="comic-card text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 flex items-start gap-2"
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
      <div className="shrink-0 border-t-[2.5px] border-gray-900 bg-white">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
