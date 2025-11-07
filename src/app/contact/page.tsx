'use client'

export const dynamic = "force-dynamic";

import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { 
  EnvelopeIcon, 
  UserIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '@/app/context/ThemeContext'

export default function ContactPage() {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const { theme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      // Validate form
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        setErrorMessage('Please fill in all fields')
        setStatus('error')
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address')
        setStatus('error')
        return
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            status: 'new'
          }
        ])

      if (error) {
        throw error
      }

      setStatus('success')
      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        message: ''
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 5000)

    } catch (error) {
      console.error('Error submitting contact form:', error)
      setErrorMessage('Failed to send message. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header user={user} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Get in Touch
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Have a question or feedback? We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className={`rounded-xl shadow-sm border p-6 md:p-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Send us a message</h2>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-800 font-semibold">Message sent successfully!</h3>
                  <p className="text-green-700 text-sm mt-1">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <ChatBubbleLeftRightIcon className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-400'}`} />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${theme === 'dark' ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400' : 'text-black border-gray-300'}`}
                  />
                </div>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formData.message.length} / 1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <EnvelopeIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Email</p>
                    <a href="mailto:support@recipeeshare.com" className="text-orange-600 hover:text-orange-700">
                      vivekvemula23@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Response Time</p>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>We typically respond within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className={`rounded-xl shadow-sm border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Common Questions</h3>
              <div className="space-y-4">
               
                <div>
                  <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>How do I report a recipe?</h4>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Use this contact form to report any inappropriate content, and we'll review it promptly.
                  </p>
                </div>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'from-gray-800 to-gray-700 border-gray-700 bg-gradient-to-br' : 'from-orange-50 to-red-50 border-orange-200 bg-gradient-to-br'}`}>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Join Our Community</h3>
              <p className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'} text-sm mb-4`}>
                 Coming soon...
              </p>
              {!user && (
                <a
                  href="/api/auth/login"
                  className="inline-block w-full text-center bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sign Up to Get Started
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
