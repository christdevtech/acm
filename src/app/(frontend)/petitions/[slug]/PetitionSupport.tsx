'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, MapPin } from 'lucide-react'
import type { Petition } from '@/payload-types'

interface PetitionSupportProps {
  petition: Petition
}

export const PetitionSupport: React.FC<PetitionSupportProps> = ({ petition }) => {
  const [isSupporting, setIsSupporting] = useState(false)
  const [hasSupported, setHasSupported] = useState(false)
  const [supportCount, setSupportCount] = useState(petition.supporterCount || 0)

  const handleSupport = async () => {
    if (hasSupported || isSupporting) return

    setIsSupporting(true)

    try {
      // Get user's location if available
      let locationData = {}
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
            })
          })
          locationData = {
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
          location: locationData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setHasSupported(true)
        // Use the updated supporter count from the server response
        if (result.supporterCount !== undefined) {
          setSupportCount(result.supporterCount)
        } else {
          setSupportCount((prev) => prev + 1)
        }
      } else {
        const errorData = await response.json()
        if (errorData.error === 'Already supported') {
          setHasSupported(true)
        } else {
          throw new Error(errorData.error || 'Failed to support petition')
        }
      }
    } catch (error) {
      console.error('Error supporting petition:', error)
      alert('Failed to support petition. Please try again.')
    } finally {
      setIsSupporting(false)
    }
  }

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6 sticky top-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-bold">{supportCount.toLocaleString()}</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {supportCount === 1 ? 'supporter' : 'supporters'}
        </p>
      </div>

      <div className="space-y-3">
        <Badge
          variant={petition.status === 'successful' ? 'default' : 'destructive'}
          className="w-full justify-center py-2"
        >
          {petition.status === 'successful' ? 'Petition Successful' : 'Petition Active'}
        </Badge>

        <Button
          onClick={handleSupport}
          disabled={isSupporting || hasSupported || petition.status === 'successful'}
          className="w-full"
          size="lg"
        >
          {isSupporting ? (
            'Supporting...'
          ) : hasSupported ? (
            <>
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Supported
            </>
          ) : petition.status === 'successful' ? (
            'Petition Closed'
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Support this petition
            </>
          )}
        </Button>
      </div>

      {petition.author && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
            Started by
          </h3>
          <p className="font-medium">{petition.author}</p>
        </div>
      )}

      {petition.location && typeof petition.location === 'object' && petition.location.name && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
            Location
          </h3>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{petition.location.name}</span>
          </div>
        </div>
      )}
    </div>
  )
}
