'use client'

import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/Tooltip'
import { Sidebar, ActiveView } from '@/components/Sidebar'
import { ChatArea } from '@/components/ChatArea'
import { Explore } from '@/components/Explore'
import { AnalyticsPanel } from '@/components/AnalyticsPanel'
import { useChatStore } from '@/store/chatStore'
import { useTheme } from '@/context/ThemeContext'
import { PanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('chat')
  const [explorePrompt, setExplorePrompt] = useState<string | undefined>()
  const { sidebarOpen, toggleSidebar } = useChatStore()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleExplorePrompt = (prompt: string) => {
    setExplorePrompt(prompt)
    setActiveView('chat')
  }

  return (
    <TooltipProvider>
      <div className={cn('flex h-screen w-full overflow-hidden transition-colors duration-200', isDark ? 'bg-[#0f0f1a]' : 'bg-gray-50')}>
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className={cn(
              'absolute top-4 left-4 z-10 rounded-xl p-2 border-2 transition-colors',
              isDark ? 'bg-[#1a1a2e] border-purple-600 text-purple-300 hover:bg-purple-900/30' : 'bg-white border-gray-900 text-gray-600 hover:bg-purple-50'
            )}
            style={{ boxShadow: isDark ? '2px 2px 0 #7c3aed' : '2px 2px 0 #1a1a2e' }}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-1 min-w-0 h-full overflow-hidden">
          {activeView === 'chat' && (
            <ChatArea
              initialPrompt={explorePrompt}
              onInitialPromptUsed={() => setExplorePrompt(undefined)}
            />
          )}
          {activeView === 'explore' && <Explore onPromptSelect={handleExplorePrompt} />}
        </div>

        <AnalyticsPanel />
      </div>
    </TooltipProvider>
  )
}
