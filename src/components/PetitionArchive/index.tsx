'use client'

import React from 'react'
import { PetitionCard } from '../PetitionCard'
import type { Petition } from '@/payload-types'

interface PetitionArchiveProps {
  petitions: Petition[]
  title?: string
  subtitle?: string
  className?: string
  showSupportButtons?: boolean
}

export const PetitionArchive: React.FC<PetitionArchiveProps> = ({
  petitions,
  title = 'Your voice matters',
  subtitle = 'These petitions need your help to achieve victory.',
  className = '',
  showSupportButtons = true,
}) => {
  if (!petitions || petitions.length === 0) {
    return (
      <div className={`py-16 text-center ${className}`}>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">No petitions available at the moment.</p>
      </div>
    )
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>}
        </div>

        {/* Petitions Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {petitions.map((petition) => (
            <PetitionCard
              key={petition.id}
              petition={petition}
              showSupportButton={showSupportButtons}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
