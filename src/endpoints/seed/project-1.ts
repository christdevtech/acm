import { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Location, Tag } from '@/payload-types'

type ProjectArgs = {
  heroImage: Media
  location: Location
  tags: Tag[]
}

export const project1: (args: ProjectArgs) => RequiredDataFromCollectionSlug<'projects'> = ({
  heroImage,
  location,
  tags,
}) => {
  return {
    title: 'Clean Water Initiative for Rural Communities',
    slug: 'clean-water-initiative',
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
                text: 'Providing access to clean, safe drinking water for rural communities across Cameroon. This project aims to install water wells and purification systems in underserved areas.',
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
    targetAmount: 50000000,
    totalDonated: 0,
    dueDate: new Date('2024-12-31').toISOString(),
    status: 'active',
    location: location.id,
    tags: tags.map(tag => tag.id),
    meta: {
      title: 'Clean Water Initiative - Africa Change Makers',
      description: 'Help us provide clean water access to rural communities in Cameroon.',
    },
  }
}