import { create } from 'zustand'
import { AnalyticsData, DailyStat } from '@/types'

interface AnalyticsState {
  data: AnalyticsData
  updateAnalytics: (data: Partial<AnalyticsData>) => void
  addDailyStat: (stat: DailyStat) => void
  incrementMessages: () => void
  incrementTokens: (tokens: number) => void
  recordModelUsage: (model: string) => void
}

const generateInitialData = (): AnalyticsData => {
  const dailyStats: DailyStat[] = []
  const today = new Date()
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dailyStats.push({
      date: date.toISOString().split('T')[0],
      messages: Math.floor(Math.random() * 100) + 20,
      users: Math.floor(Math.random() * 50) + 10,
      tokens: Math.floor(Math.random() * 50000) + 10000,
    })
  }

  return {
    totalMessages: 2847,
    activeUsers: 342,
    avgResponseTime: 1.2,
    retentionRate: 87.5,
    tokenUsage: 1524893,
    revenue: 4592.50,
    dailyStats,
    modelUsage: [
      { model: 'Gemini 3.1 Pro', count: 1250 },
      { model: 'Claude Sonnet 4', count: 890 },
      { model: 'GPT-4.1', count: 450 },
      { model: 'DeepSeek Chat', count: 257 },
    ],
  }
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: generateInitialData(),

  updateAnalytics: (newData) => {
    set((state) => ({
      data: { ...state.data, ...newData },
    }))
  },

  addDailyStat: (stat) => {
    set((state) => ({
      data: {
        ...state.data,
        dailyStats: [...state.data.dailyStats, stat],
      },
    }))
  },

  incrementMessages: () => {
    set((state) => ({
      data: {
        ...state.data,
        totalMessages: state.data.totalMessages + 1,
      },
    }))
  },

  incrementTokens: (tokens) => {
    set((state) => ({
      data: {
        ...state.data,
        tokenUsage: state.data.tokenUsage + tokens,
      },
    }))
  },

  recordModelUsage: (model) => {
    set((state) => {
      const modelUsage = [...state.data.modelUsage]
      const existingIndex = modelUsage.findIndex((m) => m.model === model)
      
      if (existingIndex >= 0) {
        modelUsage[existingIndex] = {
          ...modelUsage[existingIndex],
          count: modelUsage[existingIndex].count + 1,
        }
      } else {
        modelUsage.push({ model, count: 1 })
      }

      return {
        data: {
          ...state.data,
          modelUsage,
        },
      }
    })
  },
}))
