import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { textStyles } from '@/utilities/textStyles'

import type { GridBlock as GridBlockProps } from '@/payload-types'

export const GridBlock: React.FC<GridBlockProps> = (props) => {
  const { rows } = props

  const getColumnWidthClasses = (width: string) => {
    const widthClasses = {
      'one-fifth': 'col-span-1',
      'two-fifths': 'col-span-2',
      'three-fifths': 'col-span-3',
      'four-fifths': 'col-span-4',
      full: 'col-span-5',
    }
    return widthClasses[width as keyof typeof widthClasses] || 'col-span-1'
  }

  // Helper function to determine text color based on background
  const getAutoTextColor = (bgColor: string): string => {
    if (!bgColor || bgColor === 'bg-transparent' || bgColor === 'bg-inherit') {
      return 'text-gray-900'
    }

    // Dark backgrounds get light text
    const darkBgs = [
      'bg-black',
      'bg-gray-900',
      'bg-gray-800',
      'bg-gray-700',
      'bg-slate-900',
      'bg-slate-800',
      'bg-slate-700',
      'bg-zinc-900',
      'bg-zinc-800',
      'bg-zinc-700',
      'bg-neutral-900',
      'bg-neutral-800',
      'bg-neutral-700',
      'bg-stone-900',
      'bg-stone-800',
      'bg-stone-700',
      'bg-red-900',
      'bg-red-800',
      'bg-red-700',
      'bg-orange-900',
      'bg-orange-800',
      'bg-orange-700',
      'bg-amber-900',
      'bg-amber-800',
      'bg-amber-700',
      'bg-yellow-900',
      'bg-yellow-800',
      'bg-yellow-700',
      'bg-lime-900',
      'bg-lime-800',
      'bg-lime-700',
      'bg-green-900',
      'bg-green-800',
      'bg-green-700',
      'bg-emerald-900',
      'bg-emerald-800',
      'bg-emerald-700',
      'bg-teal-900',
      'bg-teal-800',
      'bg-teal-700',
      'bg-cyan-900',
      'bg-cyan-800',
      'bg-cyan-700',
      'bg-sky-900',
      'bg-sky-800',
      'bg-sky-700',
      'bg-blue-900',
      'bg-blue-800',
      'bg-blue-700',
      'bg-indigo-900',
      'bg-indigo-800',
      'bg-indigo-700',
      'bg-violet-900',
      'bg-violet-800',
      'bg-violet-700',
      'bg-purple-900',
      'bg-purple-800',
      'bg-purple-700',
      'bg-fuchsia-900',
      'bg-fuchsia-800',
      'bg-fuchsia-700',
      'bg-pink-900',
      'bg-pink-800',
      'bg-pink-700',
      'bg-rose-900',
      'bg-rose-800',
      'bg-rose-700',
    ]

    return darkBgs.includes(bgColor) ? 'text-white' : 'text-gray-900'
  }

  const renderItem = (item: any, index: number) => {
    const {
      itemType,
      text,
      textStyle,
      textColor,
      richText,
      link,
      overlayLink,
      media,
      mediaRounded,
      backgroundImage,
      overlayText,
      overlayOpacity,
      bgColor,
      enablePadding,
      enableRounded,
    } = item

    const itemClasses = cn(
      {
        'p-4': enablePadding,
        'rounded-xl': enableRounded,
      },
      bgColor,
    )

    // Determine text color
    const finalTextColor = textColor === 'auto' ? getAutoTextColor(bgColor) : textColor

    // Get text style classes
    const textStyleClasses =
      textStyle && textStyles[textStyle as keyof typeof textStyles]
        ? textStyles[textStyle as keyof typeof textStyles]
        : textStyles.bodyText

    const content = (() => {
      switch (itemType) {
        case 'text':
          return text ? <p className={cn(textStyleClasses, finalTextColor)}>{text}</p> : null

        case 'richText':
          return richText ? <RichText data={richText} enableGutter={false} /> : null

        case 'button':
          return link ? <CMSLink {...link} /> : null

        case 'media':
          return media ? (
            <Media
              resource={media}
              imgClassName={cn({
                'rounded-lg': mediaRounded,
              })}
            />
          ) : null

        case 'backgroundImage':
          return backgroundImage ? (
            <div className="relative min-h-[200px] rounded-xl overflow-hidden">
              <Media
                resource={backgroundImage}
                imgClassName="absolute inset-0 w-full h-full object-cover"
              />
              {overlayOpacity && <div className={cn('absolute inset-0', overlayOpacity)} />}
              <div className="relative z-10 p-6 h-full min-h-[200px] flex flex-col justify-ends">
                {overlayText && (
                  <p className={cn(textStyleClasses, 'text-white mb-4')}>{overlayText}</p>
                )}
                {overlayLink && <CMSLink {...overlayLink} className="inline-block" />}
              </div>
            </div>
          ) : null

        default:
          return null
      }
    })()

    return (
      <div key={index} className={itemClasses}>
        {content}
      </div>
    )
  }

  const renderColumn = (column: any, columnIndex: number) => {
    const { width, bgColor, items, verticalAlignment } = column

    const columnClasses = cn(getColumnWidthClasses(width), bgColor)

    // Determine vertical alignment classes
    const alignmentClasses = {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end',
    }

    const verticalAlignClass =
      alignmentClasses[verticalAlignment as keyof typeof alignmentClasses] || 'justify-start'

    return (
      <div key={columnIndex} className={columnClasses}>
        <div className={cn('flex flex-col h-full space-y-6', verticalAlignClass)}>
          {items &&
            items.length > 0 &&
            items.map((item: any, itemIndex: number) => renderItem(item, itemIndex))}
        </div>
      </div>
    )
  }

  const renderRow = (row: any, rowIndex: number) => {
    const { columns } = row

    return (
      <div
        key={rowIndex}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
      >
        {columns &&
          columns.length > 0 &&
          columns.map((column: any, columnIndex: number) => renderColumn(column, columnIndex))}
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return null
  }

  return (
    <div className="container my-16">
      <div className="space-y-8">
        {rows.map((row: any, rowIndex: number) => renderRow(row, rowIndex))}
      </div>
    </div>
  )
}
