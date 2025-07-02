'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Media } from '../Media'
import { Button } from '../ui/button'
// import { Badge } from '../ui/badge'
import { Users, MapPin, Calendar, PlaneIcon, SendIcon } from 'lucide-react'
import type { Petition } from '@/payload-types'
import { Badge } from '../ui/badge'
import RichText from '../RichText'

interface PetitionCardProps {
  petition: Petition
  showSupportButton?: boolean
  className?: string
  showTarget?: boolean
  showAuthor?: boolean
}

export const PetitionCard: React.FC<PetitionCardProps> = ({
  petition,
  showSupportButton = true,
  className = '',
  showTarget = true,
  showAuthor = true,
}) => {
  const [isSupporting, setIsSupporting] = useState(false)
  const [supportCount, setSupportCount] = useState(petition.supporterCount || 0)
  const [hasSupported, setHasSupported] = useState(false)

  const handleSupport = async () => {
    if (isSupporting || hasSupported) return

    setIsSupporting(true)

    try {
      // Get user's location if available
      let location = {}
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
            })
          })
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
        } catch (error) {
          console.log('Location access denied or unavailable')
        }
      }

      const response = await fetch('/api/support-petition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petitionId: petition.id,
          location,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Use the updated supporter count from the server response
        if (result.supporterCount !== undefined) {
          setSupportCount(result.supporterCount)
        } else {
          setSupportCount((prev) => prev + 1)
        }
        setHasSupported(true)
      } else {
        if (response.status === 409) {
          setHasSupported(true)
        } else {
          console.error('Error supporting petition:', result.error)
        }
      }
    } catch (error) {
      console.error('Error supporting petition:', error)
    } finally {
      setIsSupporting(false)
    }
  }

  const statusColor = petition.status === 'successful' ? 'bg-green-500' : 'bg-blue-500'
  const statusText = petition.status === 'successful' ? 'Successful' : 'Pending'

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card shadow-md transition-all hover:shadow-lg ${className}`}
    >
      {/* Hero Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        {petition.heroImage && typeof petition.heroImage === 'object' && (
          <Media
            resource={petition.heroImage}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
        {/* Status Badge */}
        <div className="mb-3 flex items-center justify-between absolute left-4 right-4 top-4">
          <Badge className={`${statusColor} text-white`}>{statusText}</Badge>
          {petition.location && typeof petition.location === 'object' && (
            <div className="flex items-center text-sm text-primary bg-primary-foreground p-1 rounded-full">
              <MapPin className="mr-1 h-4 w-4" />
              {petition.location.name}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Target */}
        {showTarget && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-2 items-center text-lg text-slate-600 dark:text-slate-200">
              <SendIcon className="mr-1 h-6 w-6" />
              Petition to {petition.target}
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-primary line-clamp-2">
          <Link href={`/petitions/${petition.slug}`} className="hover:text-blue-600">
            {petition.title}
          </Link>
        </h3>

        {/* Author */}
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          Petition by {petition.author}
        </p>

        {/* Description Preview */}
        {petition.description && (
          <RichText
            data={petition.description}
            className="mb-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-3"
          ></RichText>
        )}

        {/* Support Info */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center text-base font-bold text-white rounded-xl bg-indigo-800 px-4 py-2">
            <Users className="mr-1 h-4 w-4" />
            <span className="font-medium">{supportCount.toLocaleString()}</span>
            <span className="ml-1">{supportCount !== 1 ? 'supporters' : 'supporter'}</span>
          </div>
          {petition.publishedAt && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              {new Date(petition.publishedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Support Button */}
        {showSupportButton && (
          <Button
            onClick={handleSupport}
            disabled={isSupporting || hasSupported}
            className="w-full"
            variant={hasSupported ? 'outline' : 'default'}
          >
            {isSupporting ? 'Supporting...' : hasSupported ? 'Supported' : 'Support This Petition'}
          </Button>
        )}
      </div>
    </div>
  )
}
