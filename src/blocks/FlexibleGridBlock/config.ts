import type { Block, Field } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { bgColorPicker } from '@/fields/bgColorPicker'
import { textStyles } from '@/utilities/textStyles'

const itemFields: Field[] = [
  {
    name: 'itemType',
    type: 'select',
    label: 'Item Type',
    defaultValue: 'text',
    options: [
      {
        label: 'Text',
        value: 'text',
      },
      {
        label: 'Media',
        value: 'media',
      },
      {
        label: 'Link Group (Buttons)',
        value: 'linkGroup',
      },
      {
        label: 'Numbered Cards',
        value: 'numberCards',
      },
    ],
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
    label: 'Text Content',
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
        return siblingData?.itemType === 'text'
      },
    },
  },
  {
    name: 'textColor',
    type: 'select',
    label: 'Text Color',
    defaultValue: 'text-gray-900',
    options: [
      { label: 'Default Gray', value: 'text-gray-900' },
      { label: 'White', value: 'text-white' },
      { label: 'Black', value: 'text-black' },
      { label: 'Primary', value: 'text-primary' },
      { label: 'Secondary', value: 'text-secondary' },
      { label: 'Muted', value: 'text-muted-foreground' },
    ],
    admin: {
      condition: (_data, siblingData) => {
        return siblingData?.itemType === 'text'
      },
    },
  },
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
  linkGroup({
    overrides: {
      name: 'linkGroup',
      label: 'Button Links',
      admin: {
        condition: (_data, siblingData) => {
          return siblingData?.itemType === 'linkGroup'
        },
      },
    },
  }),
]

const columnFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Column Styles',
    fields: [
      {
        name: 'reverseOnMobile',
        type: 'checkbox',
        label: 'Reverse order of item flow on Mobile',
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
      {
        name: 'horizontalAlignment',
        type: 'select',
        label: 'Horizontal Alignment',
        defaultValue: 'left',
        options: [
          {
            label: 'Left',
            value: 'left',
          },
          {
            label: 'Center',
            value: 'center',
          },
          {
            label: 'Right',
            value: 'right',
          },
        ],
      },
      bgColorPicker({
        overrides: {
          name: 'columnBgColor',
          label: 'Column Background Color',
        },
      }),
      {
        name: 'columnBorderRadius',
        type: 'select',
        label: 'Column Border Radius',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'Extra Large', value: 'xl' },
          { label: '2X Large', value: '2xl' },
          { label: '3X Large', value: '3xl' },
          { label: '4X Large', value: '4xl' },
          { label: 'Full', value: 'full' },
        ],
      },
      {
        name: 'columnMinHeight',
        type: 'select',
        label: 'Minimum Height (MD and up)',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small (200px)', value: 'sm' },
          { label: 'Medium (300px)', value: 'md' },
          { label: 'Large (400px)', value: 'lg' },
          { label: 'Extra Large (500px)', value: 'xl' },
          { label: '2X Large (600px)', value: '2xl' },
          { label: '3X Large (700px)', value: '3xl' },
          { label: '4X Large (800px)', value: '4xl' },
        ],
      },
    ],
  },

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
      description:
        'Add 1-4 columns. Column widths are automatically calculated based on the number of columns.',
    },
    fields: columnFields,
    validate: (value) => {
      if (!value || value.length === 0) {
        return 'At least one column is required'
      }
      if (value.length > 4) {
        return 'Maximum 4 columns per row'
      }
      return true
    },
  },
]

export const FlexibleGridBlock: Block = {
  slug: 'flexibleGridBlock',
  interfaceName: 'FlexibleGridBlock',
  labels: {
    singular: 'Flexible Grid Block',
    plural: 'Flexible Grid Blocks',
  },
  fields: [
    // Block-level styling options
    {
      type: 'collapsible',
      label: 'Block Styling',
      admin: {
        initCollapsed: true,
      },
      fields: [
        bgColorPicker({
          overrides: {
            name: 'blockBgColor',
            label: 'Block Background Color',
          },
        }),
        {
          name: 'blockBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Block Background Image',
        },
        {
          name: 'blockBorderRadius',
          type: 'select',
          label: 'Block Border Radius',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra Large', value: 'xl' },
            { label: '2X Large', value: '2xl' },
            { label: '3X Large', value: '3xl' },
            { label: 'Full', value: 'full' },
          ],
        },
        {
          name: 'blockPadding',
          type: 'select',
          label: 'Block Padding',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra Large', value: 'xl' },
          ],
        },
      ],
    },
    // Grid content
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
