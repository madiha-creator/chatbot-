'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { X, TrendingUp, Users, Zap, DollarSign } from 'lucide-react'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { useChatStore } from '@/store/chatStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const COLORS = ['#9333ea', '#a855f7', '#c084fc', '#e9d5ff']

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
    </Card>
  )
}

export function AnalyticsPanel() {
  const { data } = useAnalyticsStore()
  const { analyticsPanelOpen, toggleAnalyticsPanel } = useChatStore()

  const last7Days = data.dailyStats.slice(-7)

  return (
    <AnimatePresence>
      {analyticsPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex flex-col h-full bg-white/80 backdrop-blur-md border-l border-gray-200 overflow-hidden shrink-0"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Analytics</h2>
            <button
              onClick={toggleAnalyticsPanel}
              className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={TrendingUp}
                label="Total Messages"
                value={data.totalMessages.toLocaleString()}
                color="bg-purple-500"
              />
              <StatCard
                icon={Users}
                label="Active Users"
                value={data.activeUsers.toLocaleString()}
                sub={`${data.retentionRate}% retention`}
                color="bg-blue-500"
              />
              <StatCard
                icon={Zap}
                label="Tokens Used"
                value={(data.tokenUsage / 1000).toFixed(0) + 'K'}
                color="bg-amber-500"
              />
              <StatCard
                icon={DollarSign}
                label="Revenue"
                value={`$${data.revenue.toLocaleString()}`}
                color="bg-green-500"
              />
            </div>

            {/* Messages chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Messages (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={last7Days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="msgGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      tickFormatter={(v) => v.slice(5)}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="messages"
                      stroke="#9333ea"
                      strokeWidth={2}
                      fill="url(#msgGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Model usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Model Usage</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <PieChart width={100} height={100}>
                    <Pie
                      data={data.modelUsage}
                      cx={45}
                      cy={45}
                      innerRadius={28}
                      outerRadius={45}
                      dataKey="count"
                      paddingAngle={2}
                    >
                      {data.modelUsage.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="flex-1 space-y-2">
                    {data.modelUsage.map((m, i) => {
                      const total = data.modelUsage.reduce((s, x) => s + x.count, 0)
                      const pct = Math.round((m.count / total) * 100)
                      return (
                        <div key={m.model} className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ background: COLORS[i % COLORS.length] }}
                          />
                          <span className="text-xs text-gray-600 truncate flex-1">{m.model}</span>
                          <span className="text-xs font-medium text-gray-900">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avg response time */}
            <Card className="p-4">
              <p className="text-xs text-gray-500 font-medium">Avg Response Time</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold text-gray-900">{data.avgResponseTime}s</p>
                <p className="text-xs text-green-600 mb-1">↓ 0.3s vs last week</p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                  style={{ width: `${Math.min((data.avgResponseTime / 5) * 100, 100)}%` }}
                />
              </div>
            </Card>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
