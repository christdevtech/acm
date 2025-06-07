import { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Location, Tag } from '@/payload-types'

type ProjectArgs = {
  heroImage: Media
  location: Location
  tags: Tag[]
}

export const project3: (args: ProjectArgs) => RequiredDataFromCollectionSlug<'projects'> = ({
  heroImage,
  location,
  tags,
}) => {
  return {
    title: 'Sustainable Agriculture Training Program',
    slug: 'sustainable-agriculture-training',
    _status: 'published',
    heroImage: heroImage.id,
    description: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Training farmers in sustainable agricultural practices to improve crop yields while protecting the environment. This program includes workshops on organic farming, water conservation, and modern farming techniques.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    targetAmount: 35000,
    totalDonated: 0,
    dueDate: new Date('2024-09-30').toISOString(),
    status: 'funded',
    location: location.id,
    tags: tags.map(tag => tag.id),
    executionResults: {
      summary: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Successfully trained over 200 farmers in sustainable practices. Crop yields increased by an average of 30% while reducing water usage by 25%.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
    meta: {
      title: 'Sustainable Agriculture Training - Africa Change Makers',
      description: 'Training farmers in sustainable practices for better yields and environmental protection.',
    },
  }
}