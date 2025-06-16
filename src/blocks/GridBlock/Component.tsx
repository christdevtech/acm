import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { textStyles } from '@/utilities/textStyles'

import type { GridBlock as GridBlockProps } from '@/payload-types'

// Extract types from GridBlock interface
type GridRow = NonNullable<GridBlockProps['rows']>[number]
type GridColumn = NonNullable<GridRow['columns']>[number]
type GridItem = NonNullable<GridColumn['items']>[number]

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

    // Handle special cases
    if (bgColor === 'bg-black') {
      return 'text-white'
    }
    if (bgColor === 'bg-white') {
      return 'text-gray-900'
    }

    // Parse Tailwind background color class (e.g., 'bg-blue-500', 'bg-gray-800')
    const bgMatch = bgColor.match(/^bg-([a-z]+)(?:-([0-9]+))?$/)
    if (!bgMatch) {
      return 'text-gray-900' // Default for unrecognized patterns
    }

    const [, colorName, shade] = bgMatch
    const shadeNumber = shade ? parseInt(shade, 10) : 500
    const isDarkThreshold = 600

    // Determine if background is dark based on shade number
    const isDark = shadeNumber >= isDarkThreshold

    return isDark ? 'text-white' : 'text-gray-900'
  }

  const renderItem = (item: GridItem, index: number) => {
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
    const finalTextColor = textColor === 'auto' && bgColor ? getAutoTextColor(bgColor) : textColor

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
          return richText ? (
            <RichText data={richText} enableGutter={false} className={cn(finalTextColor)} />
          ) : null

        case 'button':
          return link ? <CMSLink {...link} /> : null

        case 'media':
          return media ? (
            <Media
              resource={media}
              imgClassName={cn({
                'rounded-lg w-full object-cover': mediaRounded,
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
              <div className="relative z-10 p-6 h-full min-h-[200px] flex flex-col justify-end">
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

  const renderColumn = (column: GridColumn, columnIndex: number) => {
    const { width, bgColor, items, verticalAlignment } = column

    const columnClasses = cn(getColumnWidthClasses(width ? width : 'one-fifth'), bgColor)

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
            items.map((item: GridItem, itemIndex: number) => renderItem(item, itemIndex))}
        </div>
      </div>
    )
  }

  const renderRow = (row: GridRow, rowIndex: number) => {
    const { columns } = row

    return (
      <div
        key={rowIndex}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
      >
        {columns &&
          columns.length > 0 &&
          columns.map((column: GridColumn, columnIndex: number) =>
            renderColumn(column, columnIndex),
          )}
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return null
  }

  return (
    <div className="container my-16">
      <div className="space-y-8">
        {rows.map((row: GridRow, rowIndex: number) => renderRow(row, rowIndex))}
      </div>
    </div>
  )
}
