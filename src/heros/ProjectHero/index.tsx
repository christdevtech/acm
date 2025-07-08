import { cn } from '@/utilities/ui'
import React from 'react'

import type { RequiredDataFromCollectionSlug } from 'payload'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { DonationModal } from '@/components/DonationModal'

type Props = {
  project: RequiredDataFromCollectionSlug<'projects'>
}

export const ProjectHero: React.FC<Props> = ({ project }) => {
  const { title, heroImage, status, location, tags, meta } = project
  const { description } = meta || {}

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

              {/* Donate Button */}
              <div className="flex gap-4">
                <DonationModal preselectedProject={project.id}>
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3">
                    Donate Now
                  </Button>
                </DonationModal>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
