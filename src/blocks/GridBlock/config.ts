import type { Block, Field } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { bgColorPicker } from '@/fields/bgColorPicker'
import { textStyles } from '@/utilities/textStyles'
import { MediaBlock } from '../MediaBlock/config'
import { Content } from '../Content/config'

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
      {
        label: 'Background Image with Text',
        value: 'backgroundImage',
      },
      {
        label: 'Spacer',
        value: 'spacer',
      },
      {
        label: 'Numbered Cards',
        value: 'numberCards',
      },
    ],
  },
  {
    name: 'spacer',
    type: 'number',
    label: 'Spacer Height',
    defaultValue: 200,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'spacer'
      },
      description: 'The height of the spacer in pixels',
    },
  },
  {
    name: 'spacerLG',
    type: 'number',
    label: 'Spacer Height at Desktop Screens',
    defaultValue: 350,
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'spacer'
      },
      description: 'The height of the spacer in pixels',
    },
  },
  {
    name: 'numberCards',
    type: 'array',
    label: 'Numbered Cards',
    fields: [
      {
        name: 'number',
        type: 'number',
        label: 'Number',
        defaultValue: 1,
      },
      {
        name: 'title',
        type: 'text',
        label: 'Text',
        defaultValue: 'Our Mission',
      },
      {
        name: 'titleStyle',
        type: 'select',
        label: 'Text Style',
        defaultValue: 'subHeading',
        options: Object.keys(textStyles).map((key) => ({
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
          value: key,
        })),
      },
      {
        name: 'text',
        type: 'text',
        label: 'Text Content',
        defaultValue:
          'To build a new generation of African changemakers who are equipped, inspired, and empowered to lead, innovate, and drive sustainable development from within their communities.',
      },
      {
        name: 'style',
        type: 'select',
        options: [
          {
            label: 'Elevated',
            value: 'elevated',
          },
          {
            label: 'Rounded',
            value: 'rounded',
          },
          {
            label: 'Gradient',
            value: 'gradient',
          },
          {
            label: 'Minimal',
            value: 'minimal',
          },
          {
            label: 'Outlined',
            value: 'outlined',
          },
        ],
      },
    ],
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'numberCards'
      },
    },
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
    name: 'textStyle',
    type: 'select',
    label: 'Text Style',
    defaultValue: 'bodyText',
    options: Object.keys(textStyles).map((key) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
      value: key,
    })),
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'text' || siblingData?.itemType === 'backgroundImage'
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
          BlocksFeature({ blocks: [MediaBlock, Content] }),
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
  // Background Image Item Fields
  {
    name: 'backgroundImage',
    type: 'upload',
    relationTo: 'media',
    label: 'Background Image',
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'backgroundImage'
      },
    },
  },
  {
    name: 'minHeight',
    type: 'number',
    required: true,
    admin: {
      description: 'Minimum height of the background image in pixels',
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'backgroundImage'
      },
    },
  },
  {
    name: 'overlayText',
    type: 'text',
    label: 'Overlay Text',
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'backgroundImage'
      },
    },
  },
  link({
    overrides: {
      label: 'Overlay Link',
      name: 'overlayLink',
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.itemType === 'backgroundImage'
        },
      },
    },
  }),
  {
    name: 'overlayOpacity',
    type: 'select',
    label: 'Overlay Opacity',
    defaultValue: 'bg-black/50',
    options: [
      { label: 'None', value: 'bg-transparent' },
      { label: 'Light (25%)', value: 'bg-black/25' },
      { label: 'Medium (50%)', value: 'bg-black/50' },
      { label: 'Dark (75%)', value: 'bg-black/75' },
    ],
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'backgroundImage'
      },
    },
  },
  {
    name: 'textColor',
    type: 'select',
    label: 'Text Color',
    defaultValue: 'auto',
    options: [
      { label: 'Auto (based on background)', value: 'auto' },
      { label: 'White', value: 'text-white' },
      { label: 'Black', value: 'text-black' },
      { label: 'Gray 100', value: 'text-gray-100' },
      { label: 'Gray 900', value: 'text-gray-900' },
    ],
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'text' || siblingData?.itemType === 'backgroundImage'
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
  {
    type: 'collapsible',
    label: 'Column Order (Responsive)',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'orderMobile',
        type: 'select',
        label: 'Mobile Order (sm and below)',
        defaultValue: 'auto',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'First', value: 'first' },
          { label: 'Last', value: 'last' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
        ],
      },
      {
        name: 'orderTablet',
        type: 'select',
        label: 'Tablet Order (md)',
        defaultValue: 'auto',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'First', value: 'first' },
          { label: 'Last', value: 'last' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
        ],
      },
      {
        name: 'orderDesktop',
        type: 'select',
        label: 'Desktop Order (lg and up)',
        defaultValue: 'auto',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'First', value: 'first' },
          { label: 'Last', value: 'last' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
        ],
      },
    ],
  },
  {
    name: 'verticalAlignment',
    type: 'select',
    label: 'Vertical Alignment',
    defaultValue: 'top',
    options: [
      {
        label: 'Top',
        value: 'top',
      },
      {
        label: 'Center',
        value: 'center',
      },
      {
        label: 'Bottom',
        value: 'bottom',
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
      type: 'collapsible',
      label: 'Block Styles',
      fields: [
        {
          name: 'bgMedia',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Media',
          admin: {
            description: 'This media will be used as the background image for the block',
          },
        },
        {
          name: 'backgroundOverlay',
          type: 'checkbox',
          label: 'Background Overlay',
          admin: {
            description: 'Add a semi-transparent overlay to the background image',
          },
        },
        {
          name: 'overlayOptions',
          type: 'select',
          defaultValue: 'bg-orange-600/50',
          admin: {
            condition: (data, siblingData) => {
              return siblingData?.backgroundOverlay
            },
          },
          options: [
            { label: 'None', value: 'bg-transparent' },
            { label: 'Black (25%)', value: 'bg-black/25' },
            { label: 'Black (50%)', value: 'bg-black/50' },
            { label: 'Black (75%)', value: 'bg-black/75' },
            { label: 'White (25%)', value: 'bg-white/25' },
            { label: 'White (50%)', value: 'bg-white/50' },
            { label: 'White (75%)', value: 'bg-white/75' },
            { label: 'Orange (25%)', value: 'bg-orange-600/25' },
            { label: 'Orange (50%)', value: 'bg-orange-600/50' },
            { label: 'Orange (75%)', value: 'bg-orange-600/75' },
          ],
        },
      ],
    },
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
