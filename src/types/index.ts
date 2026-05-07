export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  tokens?: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  model: string
  pinned: boolean
}

export interface Model {
  id: string
  name: string
  provider: string
  description?: string
}

export interface AnalyticsData {
  totalMessages: number
  activeUsers: number
  avgResponseTime: number
  retentionRate: number
  tokenUsage: number
  revenue: number
  dailyStats: DailyStat[]
  modelUsage: { model: string; count: number }[]
}

export interface DailyStat {
  date: string
  messages: number
  users: number
  tokens: number
}
