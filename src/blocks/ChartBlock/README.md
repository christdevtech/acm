# Chart Block Component

A flexible chart block component for displaying donation impact data using donut and pie charts.

## Features

- **Chart Types**: Supports both donut and pie charts
- **Customizable Data**: Add multiple data points with custom labels, values, and colors
- **Interactive**: Hover tooltips and optional legend display
- **Responsive**: Fully responsive design that works on all screen sizes
- **Theme Support**: Supports light and dark themes
- **Accessibility**: Built with accessibility in mind

## Installation

### Prerequisites

This component requires `recharts` to be installed. Install it using pnpm:

```bash
pnpm add recharts
```

You may also need to install the types for TypeScript:

```bash
pnpm add -D @types/recharts
```

## Usage

### In Payload CMS Admin

1. Go to any page in the admin panel
2. Add a new block and select "Chart Block"
3. Configure the following fields:
   - **Chart Title**: Main heading for the chart
   - **Chart Subtitle**: Optional subtitle
   - **Chart Type**: Choose between "Donut Chart" or "Pie Chart"
   - **Chart Data**: Add data points with:
     - Label (e.g., "Healthy Food")
     - Value (percentage, 0-100)
     - Color (hex code, e.g., "#FF6B47")
   - **Show Legend**: Toggle legend visibility
   - **Show Percentages**: Toggle percentage labels on chart

### Sample Data

Here's an example of chart data that matches the provided design:

```javascript
[
  {
    label: 'Healthy Food',
    value: 30,
    color: '#FF6B47'
  },
  {
    label: 'Excursions', 
    value: 25,
    color: '#B8E6B8'
  },
  {
    label: 'Pure water',
    value: 20, 
    color: '#FF8C42'
  },
  {
    label: 'Medicine',
    value: 15,
    color: '#4FC3F7'
  },
  {
    label: 'Feeding the poor',
    value: 10,
    color: '#81C784'
  }
]
```

## Component Structure

```
src/blocks/ChartBlock/
├── Component.tsx     # Main React component
├── config.ts        # Payload CMS block configuration
└── README.md        # This documentation
```

## Customization

### Colors

The component accepts hex color codes for each data segment. You can customize colors to match your brand:

- Use the color picker in the admin panel
- Or manually enter hex codes (e.g., `#FF6B47`)

### Chart Types

- **Donut Chart**: Has a hollow center, good for displaying additional text
- **Pie Chart**: Solid circle, traditional pie chart appearance

### Styling

The component uses Tailwind CSS classes and supports:
- Light/dark theme switching
- Responsive breakpoints
- Custom container sizing

## Technical Details

### Dependencies

- `recharts`: For chart rendering
- `@/utilities/ui`: For className utilities
- `@/payload-types`: For TypeScript types

### Browser Support

Supports all modern browsers that support SVG rendering.

## Demo

A demo page can be seeded using the provided seed file:

```bash
# Run the seed command in your Payload CMS admin
# Or programmatically import and run the seedChartDemo function
```

This will create a page at `/chart-demo` showcasing the chart block with sample data.