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
  ImageIcon,
  Compass,
  Mail,
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

export type ActiveView = 'chat' | 'image' | 'explore'

interface SidebarProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
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

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id)
    setEditTitle(conv.title)
  }

  const commitEdit = (id: string) => {
    if (editTitle.trim()) updateConversationTitle(id, editTitle.trim())
    setEditingId(null)
  }

  const NAV_ITEMS = [
    { id: 'chat' as ActiveView, icon: MessageSquare, label: 'Chat' },
    { id: 'image' as ActiveView, icon: ImageIcon, label: 'Image Gen' },
    { id: 'explore' as ActiveView, icon: Compass, label: 'Explore' },
  ]

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
          isActive ? 'bg-purple-100 text-purple-900' : 'hover:bg-gray-100 text-gray-700'
        )}
        onClick={() => { if (!isEditing) { setCurrentConversation(conv.id); onViewChange('chat') } }}
      >
        <MessageSquare className={cn('h-4 w-4 shrink-0', isActive ? 'text-purple-600' : 'text-gray-400')} />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => commitEdit(conv.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(conv.id); if (e.key === 'Escape') setEditingId(null) }}
              className="w-full bg-transparent text-sm outline-none border-b border-purple-400"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p className="text-sm truncate font-medium">{conv.title}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(new Date(conv.updatedAt))}</p>
        </div>
        {conv.pinned && <Pin className="h-3 w-3 text-purple-400 shrink-0" />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn('shrink-0 rounded-lg p-1 transition-opacity opacity-0 group-hover:opacity-100', isActive && 'opacity-100')}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => startEdit(conv)}><Edit2 className="h-4 w-4 mr-2" />Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => pinConversation(conv.id)}><Pin className="h-4 w-4 mr-2" />{conv.pinned ? 'Unpin' : 'Pin'}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => deleteConversation(conv.id)}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
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
          className="flex flex-col h-full bg-white border-r-[2.5px] border-gray-900 overflow-hidden shrink-0"
          style={{ boxShadow: '4px 0 0 #1a1a2e' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b-[2.5px] border-gray-900">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center border-2 border-gray-900" style={{ boxShadow: '2px 2px 0 #1a1a2e' }}>
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="font-bangers text-lg text-gray-900 tracking-wide">Made ChatBot</span>
            </div>
            <button onClick={toggleSidebar} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200">
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Nav tabs */}
          <div className="px-3 pt-3 flex gap-1.5">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 border-2',
                  activeView === id
                    ? 'bg-purple-600 text-white border-gray-900 shadow-[2px_2px_0_#1a1a2e]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* New Chat (only in chat view) */}
          {activeView === 'chat' && (
            <div className="px-3 pt-2">
              <button
                onClick={() => { createConversation(); onViewChange('chat') }}
                className="comic-btn w-full flex items-center justify-center gap-2 bg-purple-600 text-white rounded-xl py-2 text-sm font-semibold"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </button>
            </div>
          )}

          {/* Search (only in chat view) */}
          {activeView === 'chat' && (
            <div className="px-3 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input placeholder="Search chats..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs border-2 border-gray-200" />
              </div>
            </div>
          )}

          {/* Conversations list */}
          {activeView === 'chat' && (
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {pinned.length > 0 && (
                <>
                  <p className="px-2 py-1 text-xs font-bangers text-purple-500 uppercase tracking-wider">📌 Pinned</p>
                  <AnimatePresence>{pinned.map((conv) => <ConversationItem key={conv.id} conv={conv} />)}</AnimatePresence>
                  {unpinned.length > 0 && <p className="px-2 py-1 mt-2 text-xs font-bangers text-gray-400 uppercase tracking-wider">Recent</p>}
                </>
              )}
              <AnimatePresence>{unpinned.map((conv) => <ConversationItem key={conv.id} conv={conv} />)}</AnimatePresence>
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">{search ? 'No chats found' : 'No conversations yet'}</p>
                </div>
              )}
            </div>
          )}

          {/* Spacer for non-chat views */}
          {activeView !== 'chat' && <div className="flex-1" />}

          {/* Footer */}
          <div className="px-3 py-3 border-t-[2.5px] border-gray-900 space-y-1">
            <button
              onClick={toggleAnalyticsPanel}
              className={cn(
                'w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 border-2',
                analyticsPanelOpen ? 'bg-purple-100 text-purple-700 border-purple-300' : 'text-gray-600 hover:bg-gray-100 border-transparent'
              )}
            >
              <BarChart2 className="h-4 w-4" />
              Analytics
            </button>

            {/* Creator info */}
            <div className="comic-card-purple px-3 py-2.5 mt-2">
              <p className="font-bangers text-base text-purple-700 tracking-wide">Madeha Shah</p>
              <a
                href="mailto:ms8645960@gmail.com"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition-colors mt-0.5"
              >
                <Mail className="h-3 w-3" />
                ms8645960@gmail.com
              </a>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
