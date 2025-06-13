import type { Block, Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { bgColorPicker } from '@/fields/bgColorPicker'

const itemFields: Field[] = [
  {
    name: 'itemType',
    type: 'select',
    label: 'Item Type',
    defaultValue: 'text',
    options: [
      {
        label: 'Simple Text',
        value: 'text',
      },
      {
        label: 'Rich Text',
        value: 'richText',
      },
      {
        label: 'Button',
        value: 'button',
      },
      {
        label: 'Media',
        value: 'media',
      },
    ],
  },
  {
    name: 'text',
    type: 'text',
    label: 'Simple Text',
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'text'
      },
    },
  },
  {
    name: 'richText',
    type: 'richText',
    label: 'Rich Text Content',
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
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'richText'
      },
    },
  },
  link({
    overrides: {
      label: 'Button Link',
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.itemType === 'button'
        },
      },
    },
  }),
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    label: 'Media Upload',
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'media'
      },
    },
  },
  {
    name: 'mediaRounded',
    type: 'checkbox',
    label: 'Rounded Media',
    defaultValue: true,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'media'
      },
    },
  },
  bgColorPicker({
    overrides: {
      label: 'Item Background Color',
    },
  }),
  {
    name: 'enablePadding',
    type: 'checkbox',
    label: 'Add Padding',
    defaultValue: false,
  },
  {
    name: 'enableRounded',
    type: 'checkbox',
    label: 'Rounded Corners',
    defaultValue: false,
  },
]

const columnFields: Field[] = [
  {
    name: 'width',
    type: 'select',
    label: 'Column Width',
    defaultValue: 'one-fifth',
    options: [
      {
        label: '1/5 (20%)',
        value: 'one-fifth',
      },
      {
        label: '2/5 (40%)',
        value: 'two-fifths',
      },
      {
        label: '3/5 (60%)',
        value: 'three-fifths',
      },
      {
        label: '4/5 (80%)',
        value: 'four-fifths',
      },
      {
        label: 'Full (100%)',
        value: 'full',
      },
    ],
  },
  bgColorPicker({
    overrides: {
      label: 'Column Background Color',
    },
  }),
  {
    name: 'items',
    type: 'array',
    label: 'Column Items',
    admin: {
      initCollapsed: true,
    },
    fields: itemFields,
  },
]

const rowFields: Field[] = [
  {
    name: 'columns',
    type: 'array',
    label: 'Row Columns',
    admin: {
      initCollapsed: true,
    },
    fields: columnFields,
    validate: (value) => {
      if (!value || value.length === 0) {
        return 'At least one column is required'
      }
      if (value.length > 5) {
        return 'Maximum 5 columns per row'
      }
      return true
    },
  },
]

export const GridBlock: Block = {
  slug: 'gridBlock',
  interfaceName: 'GridBlock',
  fields: [
    {
      name: 'rows',
      type: 'array',
      label: 'Grid Rows',
      admin: {
        initCollapsed: true,
      },
      fields: rowFields,
    },
  ],
}