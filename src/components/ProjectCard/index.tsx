'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '../ui/button'
import { DonationModal } from '@/components/DonationModal'

export type CardProjectData = Pick<
  Project,
  | 'id'
  | 'slug'
  | 'tags'
  | 'meta'
  | 'title'
  | 'targetAmount'
  | 'totalDonated'
  | 'status'
  | 'location'
  | 'heroImage'
  | 'donations'
  | 'dueDate'
>

export const ProjectCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardProjectData
  relationTo?: 'projects'
  showTags?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showTags, title: titleFromProps } = props

  const {
    slug,
    tags,
    meta,
    title,
    targetAmount,
    totalDonated,
    status,
    location,
    heroImage,
    donations,
    dueDate,
  } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasTags = tags && Array.isArray(tags) && tags.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  // Calculate progress percentage
  const progressPercentage =
    targetAmount && totalDonated ? Math.min((totalDonated / targetAmount) * 100, 100) : 0

  // Get donation count
  const donationCount = donations ? (Array.isArray(donations) ? donations.length : 0) : 0

  // Calculate days left
  const getDaysLeft = () => {
    if (!dueDate) return 'No deadline'
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (targetAmount && totalDonated && totalDonated >= targetAmount) return 'Target Reached'
    if (diffDays < 0) return `${diffDays} days Overdue`
    if (diffDays === -1) return '1 day Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return '1 day left'
    return `${diffDays} days left`
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'funded':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <article
      className={cn(
        'border border-border rounded-2xl overflow-hidden bg-card hover:cursor-pointer p-4',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative aspect-[4/3] w-full rounded-xl overflow-clip">
        {!heroImage && !metaImage && (
          <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
        {heroImage && typeof heroImage !== 'string' && (
          <Media resource={heroImage} size="33vw" imgClassName="w-full h-full object-cover" fill />
        )}
        {!heroImage && metaImage && typeof metaImage !== 'string' && (
          <Media resource={metaImage} size="33vw" imgClassName="w-full h-full object-cover" fill />
        )}

        {/* Status badge */}
        {status && (
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium capitalize',
                getStatusColor(status),
              )}
            >
              {status.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>
      <div className="pb-2 pt-4 relative">
        <div>
          {/* Tags */}
          {showTags && hasTags && (
            <div className="absolute -top-16 -left-4 bg-orange-600 py-2 px-6 uppercase text-sm mb-4 text-white font-medium rounded-r-full">
              <div
                className="absolute -top-4 left-0 w-0 h-0 
              border-l-[8px] border-l-transparent 
              border-t-[8px] border-t-transparent 
              border-r-[8px] border-r-orange-400 
              border-b-[8px] border-b-orange-400"
              ></div>
              <div>
                {tags?.map((tag, index) => {
                  if (typeof tag === 'object') {
                    const { title: titleFromTag } = tag
                    const tagTitle = titleFromTag || 'Untitled tag'
                    const isLast = index === tags.length - 1

                    return (
                      <Fragment key={index}>
                        {tagTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}
        </div>
        {/* Location */}
        {location && typeof location === 'object' && (
          <div className="text-sm text-muted-foreground mb-2">📍 {location.name}</div>
        )}
        {/* Title */}
        {titleToUse && (
          <div className="prose mb-3">
            <h3 className="text-lg font-semibold leading-tight">
              <Link className="not-prose hover:text-primary" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {/* Description */}
        {description && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{sanitizedDescription}</p>
          </div>
        )}
        {/* Progress section */}
        <div className="space-y-3">
          {/* Goal and raised amounts */}
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-primary">
              Goal: {targetAmount ? formatCurrency(targetAmount) : 'Not set'}
            </span>
            <span className="text-muted-foreground">
              {totalDonated ? formatCurrency(totalDonated) : '$0'} raised
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Days left and donations count */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{getDaysLeft()}</span>
            <span>
              {donationCount} donation{donationCount !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-reverse justify-between items-center">
            <Link className="not-prose hover:text-primary" href={href} ref={link.ref}>
              <Button className="bg-orange-600 text-white hover:bg-slate-900 hover:text-white font-semibold rounded-lg">
                View project
              </Button>
            </Link>
            <div data-no-card-click="true">
              <DonationModal preselectedProject={doc?.id}>
                <Button className="bg-orange-600 text-white hover:bg-slate-900 hover:text-white font-semibold rounded-lg">
                  Donate Now
                </Button>
              </DonationModal>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
