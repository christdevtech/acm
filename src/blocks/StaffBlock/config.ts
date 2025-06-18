import type { Block } from 'payload'

export const StaffBlock: Block = {
  slug: 'staffBlock',
  interfaceName: 'StaffBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Members',
    },
    {
      name: 'selectedStaff',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: true,
      label: 'Select Staff Members',
      admin: {
        description:
          'Choose staff members to display. The order here determines the display order.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'bg-stone-100 dark:bg-stone-800',
      options: [
        { label: 'Light Stone', value: 'bg-stone-100 dark:bg-stone-800' },
        { label: 'Light Green', value: 'bg-green-100 dark:bg-green-900' },
        { label: 'Light Blue', value: 'bg-blue-100 dark:bg-blue-900' },
        { label: 'Light Purple', value: 'bg-purple-100 dark:bg-purple-900' },
        { label: 'Light Yellow', value: 'bg-yellow-100 dark:bg-yellow-900' },
        { label: 'Light Pink', value: 'bg-pink-100 dark:bg-pink-900' },
        { label: 'Light Gray', value: 'bg-gray-100 dark:bg-gray-800' },
        { label: 'White/Dark', value: 'bg-white dark:bg-gray-900' },
        { label: 'Transparent', value: 'bg-transparent' },
      ],
    },
    {
      name: 'design',
      type: 'radio',
      defaultValue: 'basic',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Rounded Cards', value: 'rounded' },
      ],
    },
  ],
  labels: {
    plural: 'Staff Blocks',
    singular: 'Staff Block',
  },
}
