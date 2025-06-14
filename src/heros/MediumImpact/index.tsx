import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { getTextStyle } from '@/utilities/textStyles'

export const MediumImpactHero: React.FC<Page['hero']> = ({ mediumImpactFields }) => {
  const richText = mediumImpactFields?.richText
  const links = mediumImpactFields?.links
  const media = mediumImpactFields?.media
  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link, buttonClasses }, i) => {
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
      <div className="container ">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media}
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
