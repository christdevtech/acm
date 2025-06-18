'use client'
import React, { useState } from 'react'
import type { FAQBlock as FAQBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { ChevronDown, ChevronUp, MessageSquareDiff, Plus, X } from 'lucide-react'
import RichText from '@/components/RichText'

export const FAQBlock: React.FC<FAQBlockProps> = ({
  title,
  selectedFAQs,
  backgroundColor = 'bg-white dark:bg-gray-900',
  contactSection,
}) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  if (!selectedFAQs || selectedFAQs.length === 0) {
    return null
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const handleEmailClick = () => {
    if (contactSection?.emailAddress) {
      window.location.href = `mailto:${contactSection.emailAddress}`
    }
  }

  return (
    <div className={cn('py-16', backgroundColor)}>
      <div className="container">
        {/* Section Title */}
        {title && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {selectedFAQs.map((faq, index) => {
                if (typeof faq === 'string') return null

                const isOpen = openFAQ === index

                return (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                        {faq.question}
                      </h3>
                      {isOpen ? (
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 py-4 bg-white dark:bg-gray-900">
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          <RichText enableGutter={false} data={faq.answer} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact Section */}
          {contactSection && (
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 h-fit">
                {/* Contact Icon/Image Placeholder */}
                <div className="w-16 h-16 rounded-lg mb-6 mx-auto">
                  <MessageSquareDiff className="w-full h-full text-current" />{' '}
                </div>

                {contactSection.title && (
                  <h3 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
                    {contactSection.title}
                  </h3>
                )}

                {contactSection.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
                    {contactSection.description}
                  </p>
                )}

                {contactSection.buttonText && contactSection.emailAddress && (
                  <button
                    onClick={handleEmailClick}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {contactSection.buttonText}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
