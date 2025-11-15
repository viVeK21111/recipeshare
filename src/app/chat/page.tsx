'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/app/context/ThemeContext'

interface Message {
  query: string
  response: string
  timestamp: number
}

export default function ChatPage() {
  const { user } = useUser()
  
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load conversation from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('recipe-chat-history')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConversationHistory(parsed)
          }
        } catch (error) {
          console.error('Error loading chat history:', error)
          sessionStorage.removeItem('recipe-chat-history')
        }
      }
    }
  }, [])

  // Save conversation to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (conversationHistory.length > 0) {
        sessionStorage.setItem('recipe-chat-history', JSON.stringify(conversationHistory))
      } else {
        sessionStorage.removeItem('recipe-chat-history')
      }
    }
  }, [conversationHistory])

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [conversationHistory, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userQuery = query.trim()
    setQuery('')
    setLoading(true)

    // Add user query immediately to conversation history
    const tempMessage: Message = {
      query: userQuery,
      response: '', // Will be updated when response arrives
      timestamp: Date.now()
    }
    setConversationHistory(prev => [...prev, tempMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          history: conversationHistory.slice(-6) // Last 6 messages for context
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update the last message with the response
        setConversationHistory(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            query: userQuery,
            response: data.response,
            timestamp: Date.now()
          }
          return updated
        })
      } else {
        // Update the last message with error
        setConversationHistory(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            query: userQuery,
            response: 'Sorry, I encountered an error. Please try again.',
            timestamp: Date.now()
          }
          return updated
        })
      }
    } catch (error) {
      console.error('Error:', error)
      // Update the last message with error
      setConversationHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          query: userQuery,
          response: 'Sorry, something went wrong. Please try again.',
          timestamp: Date.now()
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    setConversationHistory([])
    sessionStorage.removeItem('recipe-chat-history')
  }

  const suggestedQueries = [
    'What are some easy Italian recipes?',
    'Give me healthy breakfast ideas',
    'How do I make perfect scrambled eggs?',
    'What can I cook with chicken and vegetables?'
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <main className="flex-1 flex flex-col max-h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 flex border-b border-gray-200 dark:border-gray-700 py-4 px-2 flex-shrink-0">
          <div className="max-w-4xl mr-auto flex items-center justify-between">
            <Link href={'/'}><img src={'/logo1.png'} className='h-11 w-8 mr-2'></img></Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ripe chat 🍳</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ask me anything about cooking!</p>
            </div>
          </div>
          <div className='flex ml-auto'>
            {conversationHistory.length > 0 && (
              <button
                onClick={handleClearChat}
                className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-900"
        >
          <div className="max-w-4xl mx-auto">
            {conversationHistory.length === 0 ? (
              // Welcome Screen
              <div className="text-center py-12 md:py-20">
                <div className="text-6xl mb-6">🤖👨‍🍳</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  What would you like to know?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Ask me about recipes, cooking techniques, or ingredient tips!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {suggestedQueries.map((suggested, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(suggested)}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-md transition-all text-left"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">{suggested}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Chat Messages
              <div className="space-y-4">
                {conversationHistory.map((message, index) => (
                  <div key={index} className="space-y-3">
                    {/* User Query */}
                    <div className="flex justify-end">
                      <div className="bg-orange-600 dark:bg-orange-700 text-white rounded-2xl px-4 py-3 max-w-2xl break-words">
                        <p>{message.query}</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    {message.response && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 max-w-3xl border border-gray-200 dark:border-gray-700 shadow-sm">
                          <div 
                            className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
                            dangerouslySetInnerHTML={{
                              __html: message.response
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/^\d+\.\s/gm, '<br/>$&')
                                .replace(/\n/g, '<br/>')
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Loading State - only show if this is the last message and it's loading */}
                    {loading && index === conversationHistory.length - 1 && !message.response && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Form - Sticky at bottom */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me about recipes..."
                disabled={loading}
                className="flex-1 px-4 py-3 text-black dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-orange-600 dark:bg-orange-700 text-white p-3 rounded-full hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUpIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
