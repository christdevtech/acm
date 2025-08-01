import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getTextStyle, textStyles } from '@/utilities/textStyles'

import type { GridBlock as GridBlockProps } from '@/payload-types'

// Extract types from GridBlock interface
type GridRow = NonNullable<GridBlockProps['rows']>[number]
type GridColumn = NonNullable<GridRow['columns']>[number]
type GridItem = NonNullable<GridColumn['items']>[number]

export const GridBlock: React.FC<GridBlockProps> = (props) => {
  const { rows, bgMedia, backgroundOverlay, overlayOptions } = props

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

  const getOrderClasses = (orderMobile?: string, orderTablet?: string, orderDesktop?: string) => {
    const orderClasses: string[] = []

    // Mobile order (default/sm)
    if (orderMobile && orderMobile !== 'auto') {
      if (orderMobile === 'first') {
        orderClasses.push('order-first')
      } else if (orderMobile === 'last') {
        orderClasses.push('order-last')
      } else {
        orderClasses.push(`order-${orderMobile}`)
      }
    }

    // Tablet order (md)
    if (orderTablet && orderTablet !== 'auto') {
      if (orderTablet === 'first') {
        orderClasses.push('md:order-first')
      } else if (orderTablet === 'last') {
        orderClasses.push('md:order-last')
      } else {
        orderClasses.push(`md:order-${orderTablet}`)
      }
    }

    // Desktop order (lg and up)
    if (orderDesktop && orderDesktop !== 'auto') {
      if (orderDesktop === 'first') {
        orderClasses.push('lg:order-first')
      } else if (orderDesktop === 'last') {
        orderClasses.push('lg:order-last')
      } else {
        orderClasses.push(`lg:order-${orderDesktop}`)
      }
    }

    return orderClasses.join(' ')
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
      spacer,
      spacerLG,
      text,
      textStyle,
      textColor,
      richText,
      link,
      overlayLink,
      media,
      mediaRounded,
      backgroundImage,
      minHeight,
      overlayText,
      overlayOpacity,
      bgColor,
      enablePadding,
      enableRounded,
      numberCards,
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
        case 'spacer':
          return spacer ? (
            <div className={cn(`min-h-[${spacer}px] `, spacerLG && `lg:min-h-[${spacerLG}px]`)} />
          ) : null

        case 'text':
          return text ? (
            <p
              className={cn(textStyleClasses, finalTextColor)}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : null

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

        case 'backgroundImage':
          const getMinHeightClass = (minHeight: number | undefined | null) => {
            return minHeight ? `min-h-[${minHeight}px]` : 'min-h-[200px]'
          }
          return backgroundImage ? (
            <div
              className={cn('relative rounded-xl overflow-hidden', getMinHeightClass(minHeight))}
              style={{ minHeight: `${minHeight}px` }}
            >
              <Media
                resource={backgroundImage}
                imgClassName="absolute inset-0 w-full h-full object-cover"
              />
              {overlayOpacity && <div className={cn('absolute inset-0', overlayOpacity)} />}
              <div
                className={cn(
                  'absolute inset-0 w-full h-full z-10 p-4', // Remove duplicate min-height, use h-full
                  'flex flex-col-reverse justify-between',
                )}
              >
                {overlayLink && <CMSLink {...overlayLink} className="inline-block" />}
                {overlayText && (
                  <p className={cn(textStyleClasses, 'text-white mb-4')}>{overlayText}</p>
                )}
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
    const { width, bgColor, items, verticalAlignment, orderMobile, orderTablet, orderDesktop } = column

    const columnClasses = cn(
      getColumnWidthClasses(width ? width : 'one-fifth'),
      getOrderClasses(orderMobile || undefined, orderTablet || undefined, orderDesktop || undefined),
      bgColor ? `${bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl` : '',
    )

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

  // Render the main content
  const content = (
    <div className="container my-16 relative z-10">
      <div className="space-y-8">
        {rows.map((row: GridRow, rowIndex: number) => renderRow(row, rowIndex))}
      </div>
    </div>
  )

  // If no background media, return content as is
  if (!bgMedia) {
    return content
  }

  // Render with background image and overlay
  return (
    <div className="relative w-full py-16 md:py-20 xl:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Media resource={bgMedia} fill imgClassName="w-full h-full object-cover" />
      </div>

      {/* Background Overlay */}
      {backgroundOverlay && (
        <div className={cn('absolute inset-0 w-full h-full', backgroundOverlay, overlayOptions)} />
      )}

      {/* Content */}
      {content}
    </div>
  )
}
