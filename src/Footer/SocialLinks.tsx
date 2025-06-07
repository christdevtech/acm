'use client'

import React from 'react'
import { Instagram, Youtube, Twitter, Globe } from 'lucide-react'
import { Footer } from '@/payload-types'

const SocialLinks: React.FC<Footer['socialLinks']> = (props) => {
  const instagram = props?.instagram
  const facebook = props?.facebook
  const twitter = props?.twitter
  const linkedin = props?.linkedin
  const youtube = props?.youtube
  const website = props?.website

  const socialItems = [
    {
      url: instagram,
      icon: <Instagram className="w-5 h-5" />,
      label: 'Instagram',
    },
    {
      url: youtube,
      icon: <Youtube className="w-5 h-5" />,
      label: 'YouTube',
    },
    {
      url: twitter,
      icon: <Twitter className="w-5 h-5" />,
      label: 'Twitter',
    },
    {
      url: website,
      icon: <Globe className="w-5 h-5" />,
      label: 'Website',
    },
  ]

  return (
    <div className="flex gap-4 flex-wrap items-center justify-start">
      {socialItems.map((item, index) => {
        if (!item.url) return null

        return (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 bg-white/30 rounded-full text-white hover:bg-white/50 transition-all duration-200 hover:scale-115"
            aria-label={item.label}
          >
            {item.icon}
          </a>
        )
      })}
    </div>
  )
}

export default SocialLinks
