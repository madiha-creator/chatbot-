'use client'

import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { Sidebar, ActiveView } from '@/components/Sidebar'
import { ChatArea } from '@/components/ChatArea'
import { ImageGen } from '@/components/ImageGen'
import { Explore } from '@/components/Explore'
import { AnalyticsPanel } from '@/components/AnalyticsPanel'
import { useChatStore } from '@/store/chatStore'
import { PanelLeft } from 'lucide-react'

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('chat')
  const [explorePrompt, setExplorePrompt] = useState<string | undefined>()
  const { sidebarOpen, toggleSidebar } = useChatStore()

  const handleExplorePrompt = (prompt: string) => {
    setExplorePrompt(prompt)
    setActiveView('chat')
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Collapsed sidebar toggle */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 z-10 rounded-xl p-2 bg-white border-2 border-gray-900 text-gray-600 hover:bg-purple-50 transition-colors"
            style={{ boxShadow: '2px 2px 0 #1a1a2e' }}
            title="Open sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {/* Main content */}
        <div className="flex flex-1 min-w-0 h-full overflow-hidden">
          {activeView === 'chat' && (
            <ChatArea
              initialPrompt={explorePrompt}
              onInitialPromptUsed={() => setExplorePrompt(undefined)}
            />
          )}
          {activeView === 'image' && <ImageGen />}
          {activeView === 'explore' && <Explore onPromptSelect={handleExplorePrompt} />}
        </div>

        {/* Analytics panel */}
        <AnalyticsPanel />
      </div>
    </TooltipProvider>
  )
}
