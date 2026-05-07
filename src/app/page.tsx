'use client'

import { TooltipProvider } from '@/components/ui/Tooltip'
import { Sidebar } from '@/components/Sidebar'
import { ChatArea } from '@/components/ChatArea'
import { AnalyticsPanel } from '@/components/AnalyticsPanel'

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Sidebar />
        <ChatArea />
        <AnalyticsPanel />
      </div>
    </TooltipProvider>
  )
}
