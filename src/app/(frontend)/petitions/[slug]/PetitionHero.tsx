'use client'

import React from 'react'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import type { Petition } from '@/payload-types'

interface PetitionHeroProps {
  petition: Petition
}

export const PetitionHero: React.FC<PetitionHeroProps> = ({ petition }) => {
  const { title, heroImage, status, author, supporterCount } = petition

  return (
    <div className="relative">
      {heroImage && typeof heroImage === 'object' && (
        <div className="h-[60dvh] w-full overflow-hidden">
          <Media resource={heroImage} fill imgClassName="h-full w-full object-cover" priority />
        </div>
      )}

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl">
            <div className="mb-4 flex items-center gap-3">
              <Badge
                variant={status === 'successful' ? 'secondary' : 'destructive'}
                className="text-sm"
              >
                {status === 'successful' ? 'Successful' : 'Pending'}
              </Badge>

              <span className="text-white/80 text-sm">{supporterCount || 0} supporters</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{title}</h1>

            {author && (
              <p className="text-white/90 text-lg">
                Started by <span className="font-semibold">{author}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
