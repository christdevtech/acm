'use client'
import { Footer, Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Footer Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}
export const MenuLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['footerMenus']>[number]>()

  const label = data?.data?.title
    ? `Footer Menu ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.title}`
    : 'Row'

  return <div>{label}</div>
}
