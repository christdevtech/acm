import React from 'react'
import { cn } from '@/utilities/ui'

import type { SpacerBlock as SpacerBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & SpacerBlockProps

export const SpacerBlock: React.FC<Props> = ({
  className,
  height = 50,
  showDivider = false,
  dividerStyle = 'solid',
  dividerColor = 'border-gray-200',
  transitionEffect = 'none',
  backgroundColor = 'transparent',
}) => {
  const getDividerClasses = () => {
    const baseClasses = 'w-full border-t'
    
    switch (dividerStyle) {
      case 'dashed':
        return `${baseClasses} border-dashed ${dividerColor}`
      case 'dotted':
        return `${baseClasses} border-dotted ${dividerColor}`
      case 'double':
        return `${baseClasses} border-double border-t-4 ${dividerColor}`
      case 'gradient':
        return 'w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'
      default:
        return `${baseClasses} ${dividerColor}`
    }
  }

  const getTransitionClasses = () => {
    switch (transitionEffect) {
      case 'fade':
        return 'bg-gradient-to-b from-transparent via-gray-50/50 to-transparent'
      case 'wave':
        return 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-100/30 before:to-transparent before:animate-pulse'
      case 'shadow':
        return 'shadow-inner bg-gray-50/30'
      default:
        return ''
    }
  }

  const getBackgroundClasses = () => {
    if (backgroundColor === 'transparent') return ''
    return backgroundColor
  }

  return (
    <div
      className={cn(
        'w-full flex items-center justify-center',
        getBackgroundClasses(),
        getTransitionClasses(),
        className,
      )}
      style={{ height: `${height}px` }}
    >
      {showDivider && (
        <div className={getDividerClasses()} />
      )}
    </div>
  )
}