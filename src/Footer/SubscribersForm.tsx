'use client'

import React, { useState } from 'react'

export const SubscribersForm = ({ headerClass }: { headerClass: string }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setMessage('Please enter your email address')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      // Dummy API call - replace with actual endpoint
      await submitEmail(email)
      setMessage('Thank you for subscribing!')
      setEmail('')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dummy API function
  const submitEmail = async (email: string): Promise<void> => {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          console.log('Email submitted:', email)
          resolve()
        } else {
          reject(new Error('API Error'))
        }
      }, 1000)
    })
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className={headerClass}>Stay up to date</h2>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-4 pr-12 bg-teal-600/30 border border-teal-500/30 rounded-lg text-white placeholder-teal-200/60 focus:outline-none focus:border-teal-400 focus:bg-teal-600/40 transition-all duration-200"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-teal-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6 rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        {message && (
          <p
            className={`mt-2 text-sm ${
              message.includes('Thank you') ? 'text-green-300' : 'text-red-300'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
