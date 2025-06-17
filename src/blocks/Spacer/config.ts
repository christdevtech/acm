import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  interfaceName: 'SpacerBlock',
  fields: [
    {
      name: 'height',
      type: 'number',
      label: 'Height (px)',
      defaultValue: 50,
      min: 10,
      max: 500,
      required: true,
      admin: {
        description: 'Height of the spacer in pixels (10-500px)',
      },
    },
    {
      name: 'showDivider',
      type: 'checkbox',
      label: 'Show Divider',
      defaultValue: false,
      admin: {
        description: 'Display a divider line in the center of the spacer',
      },
    },
    {
      name: 'dividerStyle',
      type: 'select',
      label: 'Divider Style',
      defaultValue: 'solid',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Double', value: 'double' },
        { label: 'Gradient', value: 'gradient' },
      ],
      admin: {
        condition: (data, siblingData) => siblingData?.showDivider === true,
        description: 'Style of the divider line',
      },
    },
    {
      name: 'dividerColor',
      type: 'select',
      label: 'Divider Color',
      defaultValue: 'border-gray-200',
      options: [
        { label: 'Light Gray', value: 'border-gray-200' },
        { label: 'Medium Gray', value: 'border-gray-400' },
        { label: 'Dark Gray', value: 'border-gray-600' },
        { label: 'Primary', value: 'border-primary' },
        { label: 'Secondary', value: 'border-secondary' },
        { label: 'Success', value: 'border-green-500' },
        { label: 'Warning', value: 'border-yellow-500' },
        { label: 'Error', value: 'border-red-500' },
      ],
      admin: {
        condition: (data, siblingData) => siblingData?.showDivider === true && siblingData?.dividerStyle !== 'gradient',
        description: 'Color of the divider line',
      },
    },
    {
      name: 'transitionEffect',
      type: 'select',
      label: 'Transition Effect',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Fade', value: 'fade' },
        { label: 'Wave', value: 'wave' },
        { label: 'Shadow', value: 'shadow' },
      ],
      admin: {
        description: 'Visual transition effect for the spacer area',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'transparent',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'White', value: 'bg-white' },
        { label: 'Light Gray', value: 'bg-gray-50' },
        { label: 'Medium Gray', value: 'bg-gray-100' },
        { label: 'Primary Light', value: 'bg-primary/10' },
        { label: 'Secondary Light', value: 'bg-secondary/10' },
      ],
      admin: {
        description: 'Background color for the spacer area',
      },
    },
  ],
}