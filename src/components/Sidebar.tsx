'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  MessageSquare,
  Pin,
  Trash2,
  BarChart2,
  ChevronLeft,
  Search,
  MoreHorizontal,
  Edit2,
} from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { cn, formatDate } from '@/lib/utils'
import { Conversation } from '@/types'

export function Sidebar() {
  const {
    conversations,
    currentConversationId,
    sidebarOpen,
    analyticsPanelOpen,
    createConversation,
    deleteConversation,
    setCurrentConversation,
    toggleSidebar,
    toggleAnalyticsPanel,
    pinConversation,
    updateConversationTitle,
  } = useChatStore()

  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const pinned = filtered.filter((c) => c.pinned)
  const unpinned = filtered.filter((c) => !c.pinned)

  const handleNewChat = () => {
    createConversation()
  }

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id)
    setEditTitle(conv.title)
  }

  const commitEdit = (id: string) => {
    if (editTitle.trim()) {
      updateConversationTitle(id, editTitle.trim())
    }
    setEditingId(null)
  }

  const ConversationItem = ({ conv }: { conv: Conversation }) => {
    const isActive = conv.id === currentConversationId
    const isEditing = editingId === conv.id

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={cn(
          'group relative flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150',
          isActive
            ? 'bg-purple-100 text-purple-900'
            : 'hover:bg-gray-100 text-gray-700'
        )}
        onClick={() => !isEditing && setCurrentConversation(conv.id)}
      >
        <MessageSquare
          className={cn('h-4 w-4 shrink-0', isActive ? 'text-purple-600' : 'text-gray-400')}
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => commitEdit(conv.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitEdit(conv.id)
                if (e.key === 'Escape') setEditingId(null)
              }}
              className="w-full bg-transparent text-sm outline-none border-b border-purple-400"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="text-sm truncate font-medium">{conv.title}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(new Date(conv.updatedAt))}
          </p>
        </div>

        {conv.pinned && (
          <Pin className="h-3 w-3 text-purple-400 shrink-0" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'shrink-0 rounded-lg p-1 transition-opacity',
                'opacity-0 group-hover:opacity-100',
                isActive && 'opacity-100'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => startEdit(conv)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => pinConversation(conv.id)}>
              <Pin className="h-4 w-4 mr-2" />
              {conv.pinned ? 'Unpin' : 'Pin'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => deleteConversation(conv.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    )
  }

  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex flex-col h-full bg-white/80 backdrop-blur-md border-r border-gray-200 overflow-hidden shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-sm">Made ChatBot</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-3 pt-3">
            <Button
              onClick={handleNewChat}
              className="w-full justify-start gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 pt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {pinned.length > 0 && (
              <>
                <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pinned
                </p>
                <AnimatePresence>
                  {pinned.map((conv) => (
                    <ConversationItem key={conv.id} conv={conv} />
                  ))}
                </AnimatePresence>
                {unpinned.length > 0 && (
                  <p className="px-2 py-1 mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recent
                  </p>
                )}
              </>
            )}

            <AnimatePresence>
              {unpinned.map((conv) => (
                <ConversationItem key={conv.id} conv={conv} />
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">
                  {search ? 'No chats found' : 'No conversations yet'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-3 border-t border-gray-100">
            <button
              onClick={toggleAnalyticsPanel}
              className={cn(
                'w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                analyticsPanelOpen
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <BarChart2 className="h-4 w-4" />
              Analytics
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
