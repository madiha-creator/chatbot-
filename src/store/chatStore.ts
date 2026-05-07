import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, Message, Model } from '@/types'
import { generateId } from '@/lib/utils'

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  models: Model[]
  selectedModel: string
  isLoading: boolean
  sidebarOpen: boolean
  analyticsPanelOpen: boolean
  
  // Actions
  createConversation: () => string
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateMessage: (conversationId: string, messageId: string, content: string) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  setSelectedModel: (model: string) => void
  setLoading: (loading: boolean) => void
  toggleSidebar: () => void
  toggleAnalyticsPanel: () => void
  pinConversation: (id: string) => void
  updateConversationTitle: (id: string, title: string) => void
  clearConversations: () => void
  getCurrentConversation: () => Conversation | undefined
}

const defaultModels: Model[] = [
  { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 3.1 Pro', provider: 'Google', description: 'Most capable Gemini model' },
  { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', description: 'Balanced performance' },
  { id: 'openai/gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', description: 'Latest GPT-4 variant' },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', description: 'Fast and efficient' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Fast and capable' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Multimodal model' },
]

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      models: defaultModels,
      selectedModel: defaultModels[0].id,
      isLoading: false,
      sidebarOpen: true,
      analyticsPanelOpen: false,

      createConversation: () => {
        const id = generateId()
        const newConversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          model: get().selectedModel,
          pinned: false,
        }
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id)
          const newCurrentId = state.currentConversationId === id 
            ? (newConversations[0]?.id || null) 
            : state.currentConversationId
          return {
            conversations: newConversations,
            currentConversationId: newCurrentId,
          }
        })
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id })
      },

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, newMessage],
                  updatedAt: new Date(),
                  title: c.messages.length === 0 && message.role === 'user' 
                    ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                    : c.title,
                }
              : c
          ),
        }))
      },

      updateMessage: (conversationId, messageId, content) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m
                  ),
                }
              : c
          ),
        }))
      },

      deleteMessage: (conversationId, messageId) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.filter((m) => m.id !== messageId),
                }
              : c
          ),
        }))
      },

      setSelectedModel: (model) => {
        set({ selectedModel: model })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      toggleAnalyticsPanel: () => {
        set((state) => ({ analyticsPanelOpen: !state.analyticsPanelOpen }))
      },

      pinConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
          ),
        }))
      },

      updateConversationTitle: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }))
      },

      clearConversations: () => {
        set({ conversations: [], currentConversationId: null })
      },

      getCurrentConversation: () => {
        const state = get()
        return state.conversations.find((c) => c.id === state.currentConversationId)
      },
    }),
    {
      name: 'made-chatbot-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        selectedModel: state.selectedModel,
      }),
    }
  )
)
