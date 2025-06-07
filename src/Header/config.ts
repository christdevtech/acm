import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { linkGroup } from '@/fields/linkGroup'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    linkGroup({
      overrides: {
        name: 'buttons',
        admin: {
          initCollapsed: true,
          components: {
            RowLabel: '@/Header/RowLabel#ButtonLabel',
          },
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
