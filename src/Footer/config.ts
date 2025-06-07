import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'footerMotto',
      type: 'text',
      defaultValue: 'Africa Change Makers: Bringing People Together to Create Lasting Change',
    },
    // {
    //   name: 'navItems',
    //   type: 'array',
    //   fields: [
    //     link({
    //       appearances: false,
    //     }),
    //   ],
    //   maxRows: 6,
    //   admin: {
    //     initCollapsed: true,
    //     components: {
    //       RowLabel: '@/Footer/RowLabel#RowLabel',
    //     },
    //   },
    // },
    {
      name: 'footerMenus',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'items',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
            components: {
              RowLabel: '@/Footer/RowLabel#RowLabel',
            },
          },
          maxRows: 6,
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#MenuLabel',
        },
      },
      maxRows: 3,
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          defaultValue: 'https://instagram.com',
        },
        {
          name: 'youtube',
          type: 'text',
          defaultValue: 'https://youtube.com',
        },
        {
          name: 'twitter',
          type: 'text',
          defaultValue: 'https://x.com',
        },
        {
          name: 'website',
          type: 'text',
          defaultValue: 'https://africanchangemakers.com',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'linkedin',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
