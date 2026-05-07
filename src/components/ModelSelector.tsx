'use client'

import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'

const PROVIDER_COLORS: Record<string, string> = {
  Google: 'bg-blue-100 text-blue-700',
  Anthropic: 'bg-orange-100 text-orange-700',
  OpenAI: 'bg-green-100 text-green-700',
  DeepSeek: 'bg-purple-100 text-purple-700',
}

export function ModelSelector() {
  const { models, selectedModel, setSelectedModel } = useChatStore()
  const current = models.find((m) => m.id === selectedModel)

  const byProvider = models.reduce<Record<string, typeof models>>((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = []
    acc[m.provider].push(m)
    return acc
  }, {})

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
          <span className="max-w-[140px] truncate">{current?.name ?? 'Select model'}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {Object.entries(byProvider).map(([provider, providerModels], i) => (
          <React.Fragment key={provider}>
            {i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  PROVIDER_COLORS[provider] ?? 'bg-gray-100 text-gray-700'
                }`}
              >
                {provider}
              </span>
            </DropdownMenuLabel>
            {providerModels.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className="flex flex-col items-start gap-0.5 py-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-sm">{model.name}</span>
                  {model.id === selectedModel && (
                    <Badge variant="default" className="ml-auto text-xs py-0">
                      Active
                    </Badge>
                  )}
                </div>
                {model.description && (
                  <span className="text-xs text-gray-400">{model.description}</span>
                )}
              </DropdownMenuItem>
            ))}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
