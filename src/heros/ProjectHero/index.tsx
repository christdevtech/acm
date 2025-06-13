import { cn } from '@/utilities/ui'
import React from 'react'

import type { RequiredDataFromCollectionSlug } from 'payload'

import { Media } from '@/components/Media'

type Props = {
  project: RequiredDataFromCollectionSlug<'projects'>
}

export const ProjectHero: React.FC<Props> = ({ project }) => {
  const { title, heroImage, targetAmount, totalDonated, status, location, tags, meta } = project
  const { description } = meta || {}

  // Calculate progress percentage
  const progressPercentage =
    targetAmount && totalDonated ? Math.min((totalDonated / targetAmount) * 100, 100) : 0

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'funded':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {heroImage && typeof heroImage !== 'string' && (
          <Media
            resource={heroImage}
            fill
            size="100vw"
            imgClassName="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {(!heroImage || typeof heroImage === 'string') && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative h-full flex items-end">
          <div className="container pb-16">
            <div className="max-w-4xl">
              {/* Status badge */}
              {status && (
                <div className="mb-4">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium capitalize',
                      getStatusColor(status),
                    )}
                  >
                    {status.replace('_', ' ')}
                  </span>
                </div>
              )}

              {/* Location */}
              {location && typeof location === 'object' && (
                <div className="text-white/80 mb-4">📍 {location.name}</div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {title}
              </h1>

              {/* Description */}
              {description && <p className="text-xl text-white/90 mb-8 max-w-2xl">{description}</p>}

              {/* Tags */}
              {tags && Array.isArray(tags) && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag, index) => {
                    if (typeof tag === 'object') {
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm"
                        >
                          {tag.title}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Funding Progress Card */}
      <div className="relative">
        <div className="container">
          <div className="bg-white rounded-lg shadow-lg p-6 -mt-16 relative z-10 max-w-md ml-auto">
            <div className="space-y-4">
              {/* Goal and raised amounts */}
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {totalDonated ? formatCurrency(totalDonated) : 'FCFA 0'}
                </div>
                <div className="text-sm text-gray-600">
                  raised of {targetAmount ? formatCurrency(targetAmount) : 'goal not set'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Progress percentage */}
              <div className="text-center text-sm text-gray-600">
                {progressPercentage.toFixed(1)}% funded
              </div>

              {/* Donate button */}
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
