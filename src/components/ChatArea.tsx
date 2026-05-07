'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PanelLeft, Sparkles } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useChatStore } from '@/store/chatStore'
import { MessageBubble } from '@/components/MessageBubble'
import { ChatInput } from '@/components/ChatInput'
import { ModelSelector } from '@/components/ModelSelector'
import { Button } from '@/components/ui/Button'

const SUGGESTIONS = [
  'Explain quantum computing in simple terms',
  'Write a Python function to sort a list',
  'What are the best practices for REST APIs?',
  'Help me debug this JavaScript error',
]

export function ChatArea() {
  const {
    currentConversation,
    isLoading,
    sendMessage,
    regenerateLastResponse,
  } = useChat()

  const { sidebarOpen, toggleSidebar } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentConversation?.messages])

  const messages = currentConversation?.messages ?? []
  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Open sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          <h1 className="text-sm font-semibold text-gray-800 truncate">
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
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">How can I help you?</h2>
                <p className="text-sm text-gray-500 mt-1">Start a conversation or pick a suggestion below</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => sendMessage(s)}
                  className="text-left rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-800 transition-all duration-150 shadow-sm"
                >
                  {s}
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
      <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-md">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
