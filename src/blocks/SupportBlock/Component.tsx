import React from 'react'
import type { SupportBlock as SupportBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export const SupportBlock: React.FC<SupportBlockProps> = ({
  mainTitle,
  title,
  description,
  media,
  backgroundColor = 'bg-green-100',
  links,
}) => {
  return (
    <div className="container">
      {/* Main Title */}
      {mainTitle && (
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-center md:text-left mb-8 text-gray-900">
          {mainTitle}
        </h2>
      )}
      <div className={cn('rounded-2xl p-8 md:p-12', backgroundColor)}>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left">
            {title && (
              <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 text-gray-900">
                {title}
              </h3>
            )}

            {description && (
              <div className="mb-6 text-gray-700">
                <RichText data={description} enableGutter={false} />
              </div>
            )}

            {/* Buttons */}
            {links && links.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {links.map(({ link, buttonClasses }, i) => {
                  return <CMSLink key={i} {...link} className={cn(buttonClasses)} />
                })}
              </div>
            )}
          </div>

          {/* Media Section */}
          {media && (
            <div className="flex-shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 relative">
                <Media
                  resource={media}
                  imgClassName="w-full h-full object-cover rounded-full aspect-square"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
