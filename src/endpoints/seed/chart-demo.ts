import type { Payload } from 'payload'

export const seedChartDemo = async (payload: Payload): Promise<void> => {
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Chart Demo Page',
      slug: 'chart-demo',
      _status: 'published',
      hero: {
        type: 'none',
      },
      layout: [
        {
          blockType: 'chartBlock',
          title: 'Where Your Giving Goes:',
          subtitle: 'Transparency & Impact',
          chartType: 'donut',
          showLegend: true,
          showPercentages: true,
          chartData: [
            {
              label: 'Healthy Food',
              value: 30,
              color: '#FF1493',
            },
            {
              label: 'Excursions',
              value: 25,
              color: '#8A2BE2',
            },
            {
              label: 'Pure water',
              value: 20,
              color: '#FFD700',
            },
            {
              label: 'Medicine',
              value: 15,
              color: '#228B22',
            },
            {
              label: 'Feeding the poor',
              value: 10,
              color: '#FF00FF',
            },
          ],
        },
      ],
      meta: {
        title: 'Chart Demo - Donation Impact Visualization',
        description: 'See how your donations make a real difference with our transparency chart.',
      },
    },
  })

  console.log('Chart demo page created successfully!')
}
