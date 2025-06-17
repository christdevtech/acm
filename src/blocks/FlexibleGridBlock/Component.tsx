import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getTextStyle, textStyles } from '@/utilities/textStyles'

import type { FlexibleGridBlock as FlexibleGridBlockProps } from '@/payload-types'

// Extract types from FlexibleGridBlock interface
type FlexibleGridRow = NonNullable<FlexibleGridBlockProps['rows']>[number]
type FlexibleGridColumn = NonNullable<FlexibleGridRow['columns']>[number]
type FlexibleGridItem = NonNullable<FlexibleGridColumn['items']>[number]

export const FlexibleGridBlock: React.FC<FlexibleGridBlockProps> = (props) => {
  const { rows, blockBgColor, blockBackgroundImage, blockBorderRadius, blockPadding } = props

  // Helper function to get column width classes based on number of columns
  const getColumnWidthClasses = (columnCount: number) => {
    switch (columnCount) {
      case 1:
        return 'col-span-6 lg:col-span-12' // Full width
      case 2:
        return 'col-span-6 md:col-span-3 lg:col-span-6' // Half width
      case 3:
        return 'col-span-6 md:col-span-3 lg:col-span-4' // Third width
      case 4:
        return 'col-span-6 sm:col-span-3 lg:col-span-3' // Quarter width
      default:
        return 'col-span-3 lg:col-span-3' // Default to full width
    }
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

  const renderItem = (
    item: FlexibleGridItem,
    index: number,
    horizontalAlignment?: string | null,
  ) => {
    const { itemType, text, textStyle, textColor, media, linkGroup, numberCards } = item

    // Get text style classes
    const textStyleClasses =
      textStyle && textStyles[textStyle as keyof typeof textStyles]
        ? textStyles[textStyle as keyof typeof textStyles]
        : textStyles.bodyText

    // Determine alignment classes for the item wrapper
    const itemAlignmentClasses = {
      left: 'flex justify-start',
      center: 'flex justify-center',
      right: 'flex justify-end',
    }

    const itemAlignClass = horizontalAlignment
      ? itemAlignmentClasses[horizontalAlignment as keyof typeof itemAlignmentClasses] ||
        'flex justify-start'
      : 'flex justify-start'

    const content = (() => {
      switch (itemType) {
        case 'text':
          return text ? (
            <p
              className={cn(textStyleClasses, textColor || 'text-primary')}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : null

        case 'media':
          return media ? (
            <div className={cn('w-full', 'max-w-full', itemAlignClass)}>
              <Media resource={media} imgClassName="object-fit h-auto" />
            </div>
          ) : null

        case 'linkGroup':
          return linkGroup && linkGroup.length > 0 ? (
            <div className="flex flex-col gap-4">
              {linkGroup.map((linkItem, linkIndex) => (
                <CMSLink
                  key={linkIndex}
                  {...linkItem.link}
                  className={cn(linkItem.buttonClasses)}
                  size={linkItem.size || 'default'}
                />
              ))}
            </div>
          ) : null
        case 'numberCards':
          return numberCards ? (
            <div className={cn('flex flex-col gap-4')}>
              {numberCards.map((numberCard, numberCardIndex) => {
                const { title, titleStyle, text, style, number } = numberCard
                const getBGClass = (number: number) => {
                  const colors = [
                    'bg-blue-700',
                    'bg-purple-700',
                    'bg-red-700',
                    'bg-orange-700',
                    'bg-green-700',
                    'bg-teal-700',
                  ]
                  return colors[number % 6]
                }
                const getMarginClass = (index: number) => {
                  const marginStep = (index % 6) * 4
                  return `lg:ml-${marginStep}`
                }
                const getCardClasses = (styleType: string) => {
                  const baseClasses = 'shadow-md p-4'
                  switch (styleType) {
                    case 'elevated':
                      return `${baseClasses} shadow-xl -translate-y-0.5 hover:shadow-2xl transition-all duration-300`
                    case 'rounded':
                      return `${baseClasses} rounded-2xl overflow-hidden`
                    case 'gradient':
                      return `${baseClasses} bg-gradient-to-br from-indigo-500 to-purple-600 text-white`
                    case 'minimal':
                      return 'border-none bg-transparent shadow-none'
                    case 'outlined':
                      return `${baseClasses} border-2 border-solid bg-transparent`
                    default:
                      return baseClasses
                  }
                }
                return (
                  <div
                    key={numberCardIndex}
                    className={cn(
                      'flex justify-start items-start gap-4 border',
                      getMarginClass(numberCardIndex),
                      getCardClasses(style || ''),
                    )}
                  >
                    <div
                      className={cn(
                        getBGClass(numberCardIndex),
                        'flex aspect-square rounded-full h-16 w-16 items-center justify-center',
                      )}
                    >
                      <span className={cn('text-2xl font-bold text-white')}>{number}</span>
                    </div>
                    <div className={cn('text-lg font-medium')}>
                      <h3 className={cn(getTextStyle(titleStyle || 'subHeading'))}>{title}</h3>
                      <p className={cn(getTextStyle('bodyText'))}>{text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null

        default:
          return null
      }
    })()

    return (
      <div key={index} className={cn('w-full', itemAlignClass)}>
        {content}
      </div>
    )
  }

  const renderColumn = (column: FlexibleGridColumn, columnIndex: number, columnCount: number) => {
    const {
      items,
      columnBgColor,
      columnBorderRadius,
      columnMinHeight,
      verticalAlignment,
      horizontalAlignment,
    } = column

    const columnWidthClass = getColumnWidthClasses(columnCount)

    // Determine vertical alignment classes
    const verticalAlignmentClasses = {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end',
    }

    // Determine horizontal alignment classes
    const horizontalAlignmentClasses = {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    }

    const verticalAlignClass =
      verticalAlignmentClasses[verticalAlignment as keyof typeof verticalAlignmentClasses] ||
      'justify-start'

    const horizontalAlignClass =
      horizontalAlignmentClasses[horizontalAlignment as keyof typeof horizontalAlignmentClasses] ||
      'items-start text-left'

    const columnClasses = cn(
      columnWidthClass,
      'flex flex-col space-y-4 p-4',
      verticalAlignClass,
      horizontalAlignClass,
      {
        'rounded-none': columnBorderRadius === 'none',
        'rounded-sm': columnBorderRadius === 'sm',
        'rounded-md': columnBorderRadius === 'md',
        'rounded-lg': columnBorderRadius === 'lg',
        'rounded-xl': columnBorderRadius === 'xl',
        'rounded-2xl': columnBorderRadius === '2xl',
        'rounded-3xl': columnBorderRadius === '3xl',
        'rounded-full': columnBorderRadius === 'full',
      },
      columnBgColor,
      {
        'md:min-h-[200px]': columnMinHeight === 'sm',
        'md:min-h-[300px]': columnMinHeight === 'md',
        'md:min-h-[400px]': columnMinHeight === 'lg',
        'md:min-h-[500px]': columnMinHeight === 'xl',
      },
    )

    return (
      <div key={columnIndex} className={columnClasses}>
        {items &&
          items.length > 0 &&
          items.map((item: FlexibleGridItem, itemIndex: number) =>
            renderItem(item, itemIndex, horizontalAlignment),
          )}
      </div>
    )
  }

  const renderRow = (row: FlexibleGridRow, rowIndex: number) => {
    const { columns } = row
    const columnCount = columns ? columns.length : 0

    // Limit to maximum of 4 columns
    const validColumns = columns ? columns : []

    return (
      <div key={rowIndex} className="grid grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6">
        {validColumns.map((column: FlexibleGridColumn, columnIndex: number) =>
          renderColumn(column, columnIndex, columnCount),
        )}
      </div>
    )
  }

  if (!rows || rows.length === 0) {
    return null
  }

  // Block-level styling
  const blockClasses = cn(
    'container w-full my-16',
    {
      'p-4': blockPadding === 'sm',
      'p-6': blockPadding === 'md',
      'p-8': blockPadding === 'lg',
      'p-12': blockPadding === 'xl',
      'rounded-none': blockBorderRadius === 'none',
      'rounded-sm': blockBorderRadius === 'sm',
      'rounded-md': blockBorderRadius === 'md',
      'rounded-lg': blockBorderRadius === 'lg',
      'rounded-xl': blockBorderRadius === 'xl',
      'rounded-2xl': blockBorderRadius === '2xl',
      'rounded-3xl': blockBorderRadius === '3xl',
      'rounded-full': blockBorderRadius === 'full',
    },
    blockBgColor,
  )

  const content = (
    <div className="space-y-8">
      {rows.map((row: FlexibleGridRow, rowIndex: number) => renderRow(row, rowIndex))}
    </div>
  )

  // If there's a background image, wrap content with background image
  if (blockBackgroundImage || blockBgColor) {
    return (
      <div className="container">
        <div className={cn(blockClasses, 'relative overflow-hidden')}>
          {blockBackgroundImage && (
            <Media
              resource={blockBackgroundImage}
              imgClassName="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="relative z-10">{content}</div>
        </div>
      </div>
    )
  }

  return <div className={blockClasses}>{content}</div>
}
