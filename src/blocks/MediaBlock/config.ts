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
  ],
}
