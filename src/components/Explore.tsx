'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Code2, BookOpen, Lightbulb, Palette, Globe, Calculator,
  Music, FlaskConical, Briefcase, Heart, Zap, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExploreCard {
  icon: React.ElementType
  title: string
  description: string
  prompts: string[]
  color: string
  bg: string
}

const CATEGORIES: ExploreCard[] = [
  {
    icon: Code2,
    title: 'Coding',
    description: 'Debug, build, and learn programming',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-300',
    prompts: ['Explain async/await in JavaScript', 'Write a REST API in Python', 'Debug this React component'],
  },
  {
    icon: Palette,
    title: 'Creative Writing',
    description: 'Stories, poems, and scripts',
    color: 'text-pink-600',
    bg: 'bg-pink-50 border-pink-300',
    prompts: ['Write a short sci-fi story', 'Create a poem about the ocean', 'Write a movie pitch'],
  },
  {
    icon: Lightbulb,
    title: 'Brainstorming',
    description: 'Ideas, plans, and strategies',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 border-yellow-300',
    prompts: ['10 startup ideas for 2025', 'Marketing strategy for a new app', 'Creative names for my business'],
  },
  {
    icon: BookOpen,
    title: 'Learning',
    description: 'Explain complex topics simply',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-300',
    prompts: ['Explain quantum physics simply', 'How does the stock market work?', 'Teach me machine learning basics'],
  },
  {
    icon: Globe,
    title: 'Languages',
    description: 'Translate and learn languages',
    color: 'text-teal-600',
    bg: 'bg-teal-50 border-teal-300',
    prompts: ['Translate this to Spanish', 'Teach me basic Japanese phrases', 'Fix my English grammar'],
  },
  {
    icon: Calculator,
    title: 'Math & Science',
    description: 'Solve problems step by step',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-300',
    prompts: ['Solve this calculus problem', 'Explain the Pythagorean theorem', 'How does DNA replication work?'],
  },
  {
    icon: Briefcase,
    title: 'Business',
    description: 'Emails, reports, and analysis',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-300',
    prompts: ['Write a professional email', 'Create a business plan outline', 'Analyze this market trend'],
  },
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Tips for a healthier lifestyle',
    color: 'text-red-500',
    bg: 'bg-red-50 border-red-300',
    prompts: ['Create a workout plan', 'Healthy meal prep ideas', 'Tips for better sleep'],
  },
  {
    icon: Music,
    title: 'Music & Arts',
    description: 'Lyrics, chords, and creativity',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-300',
    prompts: ['Write song lyrics about love', 'Explain music theory basics', 'Suggest art styles to learn'],
  },
  {
    icon: FlaskConical,
    title: 'Research',
    description: 'Deep dives and summaries',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 border-cyan-300',
    prompts: ['Summarize climate change research', 'What is CRISPR technology?', 'History of artificial intelligence'],
  },
  {
    icon: Zap,
    title: 'Productivity',
    description: 'Work smarter, not harder',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-300',
    prompts: ['Create a daily schedule', 'Best note-taking methods', 'How to beat procrastination'],
  },
  {
    icon: Star,
    title: 'Fun & Games',
    description: 'Trivia, jokes, and entertainment',
    color: 'text-rose-500',
    bg: 'bg-rose-50 border-rose-300',
    prompts: ['Tell me a funny joke', 'Create a trivia quiz', 'Suggest a fun weekend activity'],
  },
]

interface ExploreProps {
  onPromptSelect: (prompt: string) => void
}

export function Explore({ onPromptSelect }: ExploreProps) {
  return (
    <div className="flex flex-col flex-1 min-w-0 h-full comic-bg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b-[2.5px] border-gray-900 px-6 py-4" style={{ boxShadow: '0 3px 0 #1a1a2e' }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-gray-900" style={{ boxShadow: '2px 2px 0 #1a1a2e' }}>
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bangers text-2xl text-gray-900 tracking-wide">Explore</h1>
            <p className="text-xs text-gray-500">Discover what AI can do for you</p>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="mx-6 mt-6 rounded-2xl border-[2.5px] border-gray-900 overflow-hidden" style={{ boxShadow: '4px 4px 0 #1a1a2e' }}>
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-6 py-5 text-white">
          <p className="font-bangers text-3xl tracking-wide mb-1">What can I help you with? 🚀</p>
          <p className="text-sm text-white/80">Click any prompt below to start a conversation instantly</p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="comic-card p-4 flex flex-col gap-3"
            >
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center border-2 border-gray-900', cat.bg)} style={{ boxShadow: '2px 2px 0 #1a1a2e' }}>
                  <cat.icon className={cn('h-4.5 w-4.5', cat.color)} />
                </div>
                <div>
                  <p className="font-bangers text-base text-gray-900 tracking-wide">{cat.title}</p>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </div>
              </div>

              {/* Prompts */}
              <div className="space-y-1.5">
                {cat.prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => onPromptSelect(p)}
                    className={cn(
                      'w-full text-left rounded-xl px-3 py-2 text-xs font-medium border-2 transition-all duration-150',
                      'bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:shadow-[2px_2px_0_#1a1a2e] hover:bg-gray-50'
                    )}
                  >
                    → {p}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
