'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { getTextStyle } from '@/utilities/textStyles'

export const HighImpactHero: React.FC<Page['hero']> = ({ highImpactFields }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const title = highImpactFields?.title
  const subtitle = highImpactFields?.subtitle
  const description = highImpactFields?.description
  const buttons = highImpactFields?.buttons

  useEffect(() => {
    setHeaderTheme('light')
  })

  return (
    <div
      className="relative flex items-center justify-center py-16 md:py-20 xl:py-24"
      data-theme="dark"
    >
      <div className="container z-10 relative flex items-center justify-center">
        <div className={`container md:text-center space-y-6`}>
          {title && <h1 className={`${getTextStyle('heroTitle')}`}>{title}</h1>}
          {subtitle && <h2 className={`${getTextStyle('heroSubTitle')}`}>{subtitle}</h2>}
          {description && (
            <RichText
              className={`${getTextStyle('heroDesription')} max-w-[64rem] mx-auto`}
              data={description}
              enableGutter={false}
              enableProse={false}
            />
          )}
          {Array.isArray(buttons) && buttons.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {buttons.map(({ link, buttonClasses }, i) => {
                return (
                  <li key={i}>
                    <CMSLink
                      {...link}
                      className={cn(buttonClasses, getTextStyle('buttonTextLarge'))}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
