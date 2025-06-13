import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

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

  const renderItem = (item: any, index: number) => {
    const {
      itemType,
      text,
      richText,
      link,
      media,
      mediaRounded,
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

    const content = (() => {
      switch (itemType) {
        case 'text':
          return text ? <p>{text}</p> : null

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
    const { width, bgColor, items } = column

    const columnClasses = cn(getColumnWidthClasses(width), bgColor)

    return (
      <div key={columnIndex} className={columnClasses}>
        <div className="space-y-6">
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
