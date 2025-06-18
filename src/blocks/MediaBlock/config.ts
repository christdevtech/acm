import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'bordered',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'rounded',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      options: [
        {
          label: '16:9',
          value: 'aspect-[16/9]',
        },
        {
          label: '4:3',
          value: 'aspect-[4/3]',
        },
        {
          label: '2:1',
          value: 'aspect-[2/1]',
        },
        {
          label: '1:1',
          value: 'aspect-square',
        },
      ],
    },
  ],
}
