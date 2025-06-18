import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FAQBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'selectedFAQs',
      type: 'relationship',
      relationTo: 'faq',
      hasMany: true,
      label: 'Select FAQ Items',
      admin: {
        description: 'Choose FAQ items to display. The order here determines the display order.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'bg-white dark:bg-gray-900',
      options: [
        { label: 'White/Dark', value: 'bg-white dark:bg-gray-900' },
        { label: 'Light Stone', value: 'bg-stone-100 dark:bg-stone-800' },
        { label: 'Light Green', value: 'bg-green-100 dark:bg-green-900' },
        { label: 'Light Blue', value: 'bg-blue-100 dark:bg-blue-900' },
        { label: 'Light Purple', value: 'bg-purple-100 dark:bg-purple-900' },
        { label: 'Light Yellow', value: 'bg-yellow-100 dark:bg-yellow-900' },
        { label: 'Light Pink', value: 'bg-pink-100 dark:bg-pink-900' },
        { label: 'Light Gray', value: 'bg-gray-100 dark:bg-gray-800' },
        { label: 'Transparent', value: 'bg-transparent' },
      ],
    },
    {
      name: 'contactSection',
      type: 'group',
      label: 'Contact Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Contact Section Title',
          defaultValue: 'Do you have more questions?',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          defaultValue: 'End-to-end payments and financial management in a single solution. Meet the right platform to help realize.',
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
          defaultValue: 'Shoot a Direct Mail',
        },
        {
          name: 'emailAddress',
          type: 'email',
          label: 'Email Address',
          required: true,
          admin: {
            description: 'The email address that will be used when users click the contact button.',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'FAQ Blocks',
    singular: 'FAQ Block',
  },
}