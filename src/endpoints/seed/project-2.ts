import { RequiredDataFromCollectionSlug } from 'payload'
import type { Media, Location, Tag } from '@/payload-types'

type ProjectArgs = {
  heroImage: Media
  location: Location
  tags: Tag[]
}

export const project2: (args: ProjectArgs) => RequiredDataFromCollectionSlug<'projects'> = ({
  heroImage,
  location,
  tags,
}) => {
  return {
    title: 'Education Technology for Remote Schools',
    slug: 'education-technology-remote-schools',
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
                text: 'Bringing modern educational technology to remote schools in Africa. This initiative focuses on providing tablets, internet connectivity, and digital learning resources to enhance educational outcomes.',
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
    targetAmount: 7500000,
    totalDonated: 0,
    dueDate: new Date('2025-06-30').toISOString(),
    status: 'planning',
    location: location.id,
    tags: tags.map(tag => tag.id),
    meta: {
      title: 'Education Technology Initiative - Africa Change Makers',
      description: 'Help us bring modern technology to remote schools across Africa.',
    },
  }
}