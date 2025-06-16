import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post, Project } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  icon?: string | null
  iconPosition?: 'left' | 'right' | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'projects'
    value: Page | Post | Project | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    icon,
    iconPosition,
    size: sizeFromProps,
    url,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link
        className={cn(className, 'flex justify-center items-center gap-2')}
        href={href || url || ''}
        {...newTabProps}
      >
        {icon && icon !== 'none' && iconPosition === 'left' && (
          <span dangerouslySetInnerHTML={{ __html: icon }} />
        )}
        {label && label}
        {children && children}
        {icon && icon !== 'none' && iconPosition === 'right' && (
          <span dangerouslySetInnerHTML={{ __html: icon }} />
        )}
      </Link>
    </Button>
  )
}
