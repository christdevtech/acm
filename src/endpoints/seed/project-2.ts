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
    targetAmount: 7500000,
    totalDonated: 0,
    dueDate: new Date('2025-06-30').toISOString(),
    status: 'planning',
    location: location.id,
    tags: tags.map((tag) => tag.id),
    meta: {
      title: 'Education Technology Initiative - Africa Change Makers',
      description: 'Help us bring modern technology to remote schools across Africa.',
    },
  }
}
