import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      lowImpactFields?: never
    }
  | (Omit<Page['hero'], 'lowImpactFields'> & {
      children?: never
      lowImpactFields?: Page['hero']['lowImpactFields']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, lowImpactFields }) => {
  const richText = lowImpactFields?.richText
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
