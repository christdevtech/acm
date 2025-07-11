'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { GiftIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { DonationModal } from '@/components/DonationModal'
import { Button } from '@/components/ui/button'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const buttons = data?.buttons || []

  return (
    <nav className="flex gap-4 items-center">
      <div className="flex gap-8 md:mr-4">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
      </div>

      {buttons.map(({ link, buttonClasses }, i) => {
        return (
          <CMSLink key={i} {...link} className={cn('block w-full text-center', buttonClasses)} />
        )
      })}

      <DonationModal>
        <Button variant="default" size="sm" className="h-10">
          Donate Now <GiftIcon className="w-5 h-5 ml-2" />
        </Button>
      </DonationModal>

      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
