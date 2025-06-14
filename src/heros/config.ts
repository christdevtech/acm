import type { Field } from 'payload'

import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  SubscriptFeature,
  SuperscriptFeature,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'highImpactFields',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                AlignFeature(),
                SuperscriptFeature(),
                SubscriptFeature(),
              ]
            },
          }),
        },
        linkGroup({
          buttonClass: [
            'bg-orange-600',
            'text-white',
            'hover:bg-slate-800',
            'hover:text-white',
            'rounded-xl',
            'px-12',
            'py-8',
          ],
          overrides: {
            maxRows: 2,
            name: 'buttons',
          },
        }),
      ],
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
    },
    {
      name: 'mediumImpactFields',
      type: 'group',
      fields: [
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                AlignFeature(),
                SuperscriptFeature(),
                SubscriptFeature(),
              ]
            },
          }),
        },
        linkGroup({
          overrides: {
            maxRows: 3,
            name: 'links',
          },
        }),
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
        },
      ],
      admin: {
        condition: (_, { type } = {}) => ['mediumImpact'].includes(type),
      },
    },
    {
      name: 'lowImpactFields',
      type: 'group',
      fields: [
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                AlignFeature(),
                SuperscriptFeature(),
                SubscriptFeature(),
              ]
            },
          }),
        },
      ],
      admin: {
        condition: (_, { type } = {}) => ['lowImpact'].includes(type),
      },
    },
  ],
  label: false,
}
