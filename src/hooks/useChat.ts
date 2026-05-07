import { useChatStore } from '@/store/chatStore'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { Message } from '@/types'

export function useChat() {
  const { 
    conversations, 
    currentConversationId, 
    selectedModel, 
    isLoading,
    createConversation,
    addMessage,
    updateMessage,
    setLoading,
    setSelectedModel,
    getCurrentConversation,
  } = useChatStore()

  const { incrementMessages, incrementTokens, recordModelUsage } = useAnalyticsStore()

  const sendMessage = async (content: string) => {
    let conversationId = currentConversationId

    // Create a new conversation if none exists
    if (!conversationId) {
      conversationId = createConversation()
    }

    // Add user message
    addMessage(conversationId, {
      role: 'user',
      content,
    })

    setLoading(true)

    try {
      const conversation = useChatStore.getState().conversations.find(c => c.id === conversationId)
      const messages = conversation?.messages || []

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let assistantContent = ''

      // Add initial empty assistant message
      addMessage(conversationId, {
        role: 'assistant',
        content: '',
        model: selectedModel,
      })

      const conversationAfterAdd = useChatStore.getState().conversations.find(c => c.id === conversationId)
      const assistantMessage = conversationAfterAdd?.messages[conversationAfterAdd.messages.length - 1]

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantContent += parsed.content
                if (assistantMessage) {
                  updateMessage(conversationId!, assistantMessage.id, assistantContent)
                }
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Record analytics
      incrementMessages()
      const tokenEstimate = Math.ceil((content.length + assistantContent.length) / 4)
      incrementTokens(tokenEstimate)
      
      const modelInfo = useChatStore.getState().models.find(m => m.id === selectedModel)
      if (modelInfo) {
        recordModelUsage(modelInfo.name)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      addMessage(conversationId, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const regenerateLastResponse = async () => {
    const conversation = getCurrentConversation()
    if (!conversation || conversation.messages.length < 2) return

    const lastUserMessage = [...conversation.messages]
      .reverse()
      .find(m => m.role === 'user')
    
    if (lastUserMessage) {
      // Remove last assistant message if exists
      const lastMessage = conversation.messages[conversation.messages.length - 1]
      if (lastMessage.role === 'assistant') {
        useChatStore.getState().deleteMessage(conversation.id, lastMessage.id)
      }
      
      await sendMessage(lastUserMessage.content)
    }
  }

  return {
    conversations,
    currentConversation: getCurrentConversation(),
    selectedModel,
    isLoading,
    sendMessage,
    regenerateLastResponse,
    setSelectedModel,
    createConversation,
  }
}
