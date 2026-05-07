'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, RefreshCw, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { Message } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'
import { cn, formatMessageTime } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  onRegenerate?: () => void
  isLast?: boolean
}

function CopyButton({ text, isDark }: { text: string; isDark: boolean }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className={cn('rounded-lg p-1.5 transition-colors', isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100')}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

export function MessageBubble({ message, onRegenerate, isLast }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [copied, setCopied] = useState(false)

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('group flex gap-3 px-4 py-2', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0 mt-1">
        {isUser ? (
          <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800">
            <User className="h-4 w-4 text-white" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-400 text-xs font-bold">
            AI
          </AvatarFallback>
        )}
      </Avatar>

      {/* Content */}
      <div className={cn('flex flex-col gap-1 max-w-[80%]', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed border-[2px]',
            isUser
              ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white rounded-tr-sm border-transparent'
              : isDark
                ? 'bg-[#1e1e35] border-purple-800 text-gray-100 rounded-tl-sm'
                : 'bg-white border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : message.content === '' ? (
            <span className="inline-flex gap-1 items-center py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce" />
            </span>
          ) : (
            <div className={cn('prose prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-headings:my-2', isDark && 'prose-invert')}>
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match
                    if (isInline) {
                      return (
                        <code
                          className={cn('rounded px-1 py-0.5 text-xs font-mono', isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-gray-100 text-purple-700')}
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    }
                    const codeString = String(children).replace(/\n$/, '')
                    return (
                      <div className="relative rounded-xl overflow-hidden my-2">
                        <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                          <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                          <CopyButton text={codeString} isDark={isDark} />
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8rem' }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    )
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className={cn('underline underline-offset-2', isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-800')}
                      >
                        {children}
                      </a>
                    )
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className={cn('flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity', isUser ? 'flex-row-reverse' : 'flex-row')}>
          <span className={cn('text-xs', isDark ? 'text-gray-600' : 'text-gray-400')}>
            {formatMessageTime(new Date(message.timestamp))}
          </span>
          {message.model && (
            <span className={cn('text-xs rounded-full px-2 py-0.5', isDark ? 'text-gray-500 bg-white/5' : 'text-gray-400 bg-gray-100')}>
              {message.model.split('/').pop()}
            </span>
          )}
          <button
            onClick={handleCopyMessage}
            className={cn('rounded-lg p-1 transition-colors', isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100')}
          >
            {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
          </button>
          {!isUser && isLast && onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} className="h-6 px-2 text-xs gap-1">
              <RefreshCw className="h-3 w-3" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
