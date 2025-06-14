import type { Block } from 'payload'

export const ChartBlock: Block = {
  slug: 'chartBlock',
  interfaceName: 'ChartBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Chart Title',
      required: true,
      defaultValue: 'Where Your Giving Goes: Transparency & Impact',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Chart Subtitle',
      defaultValue: 'Ensuring every donation makes a real difference - see how your generosity transforms lives',
    },
    {
      name: 'chartType',
      type: 'select',
      label: 'Chart Type',
      defaultValue: 'donut',
      options: [
        {
          label: 'Donut Chart',
          value: 'donut',
        },
        {
          label: 'Pie Chart',
          value: 'pie',
        },
      ],
    },
    {
      name: 'chartData',
      type: 'array',
      label: 'Chart Data',
      minRows: 1,
      defaultValue: [
        {
          label: 'Healthy Food',
          value: 30,
          color: '#FF8C42'
        },
        {
          label: 'Excursions',
          value: 25,
          color: '#32CD32'
        },
        {
          label: 'Pure Water',
          value: 20,
          color: '#FF6B6B'
        },
        {
          label: 'Medicine',
          value: 15,
          color: '#4ECDC4'
        },
        {
          label: 'Feeding the Poor',
          value: 10,
          color: '#228B22'
        }
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'value',
          type: 'number',
          label: 'Value (Percentage)',
          required: true,
          min: 0,
          max: 100,
        },
        {
          name: 'color',
          type: 'select',
          label: 'Color',
          required: true,
          defaultValue: '#FF6B6B',
          options: [
            { label: 'Coral Red', value: '#FF6B6B' },
            { label: 'Electric Blue', value: '#4ECDC4' },
            { label: 'Bright Orange', value: '#FF8C42' },
            { label: 'Lime Green', value: '#32CD32' },
            { label: 'Hot Pink', value: '#FF1493' },
            { label: 'Purple', value: '#8A2BE2' },
            { label: 'Turquoise', value: '#40E0D0' },
            { label: 'Gold', value: '#FFD700' },
            { label: 'Crimson', value: '#DC143C' },
            { label: 'Forest Green', value: '#228B22' },
            { label: 'Royal Blue', value: '#4169E1' },
            { label: 'Orange Red', value: '#FF4500' },
            { label: 'Magenta', value: '#FF00FF' },
            { label: 'Teal', value: '#008080' },
            { label: 'Indigo', value: '#4B0082' }
          ],
          admin: {
            description: 'Select a color for this data segment',
          },
        },
      ],
    },
    {
      name: 'showLegend',
      type: 'checkbox',
      label: 'Show Legend',
      defaultValue: true,
    },
    {
      name: 'showPercentages',
      type: 'checkbox',
      label: 'Show Percentages on Chart',
      defaultValue: true,
    },
  ],
  labels: {
    plural: 'Chart Blocks',
    singular: 'Chart Block',
  },
}