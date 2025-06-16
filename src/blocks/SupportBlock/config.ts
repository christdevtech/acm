import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const SupportBlock: Block = {
  slug: 'supportBlock',
  interfaceName: 'SupportBlock',
  fields: [
    {
      name: 'mainTitle',
      type: 'text',
      label: 'Main Title',
      defaultValue: 'Support to Africa Change Makers',
      // required: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Support the Organiation',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'bg-green-100',
      options: [
        { label: 'Light Green', value: 'bg-green-100' },
        { label: 'Light Blue', value: 'bg-blue-100' },
        { label: 'Light Purple', value: 'bg-purple-100' },
        { label: 'Light Yellow', value: 'bg-yellow-100' },
        { label: 'Light Pink', value: 'bg-pink-100' },
        { label: 'Light Gray', value: 'bg-gray-100' },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Support Blocks',
    singular: 'Support Block',
  },
}
