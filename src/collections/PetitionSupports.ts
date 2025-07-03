import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const PetitionSupports: CollectionConfig = {
  slug: 'petition-supports',
  access: {
    create: anyone, // Allow anyone to support a petition
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['petition', 'location', 'createdAt'],
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'petition',
      type: 'relationship',
      relationTo: 'petitions',
      required: true,
      admin: {
        description: 'The petition being supported',
      },
    },

    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'region',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'latitude',
          type: 'number',
        },
        {
          name: 'longitude',
          type: 'number',
        },
      ],
      admin: {
        description: 'Geographic location of the supporter',
      },
    },

  ],
  hooks: {

    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Update the supporter count on the petition
          const payload = req.payload
          const petitionId = typeof doc.petition === 'string' ? doc.petition : doc.petition.id
          try {
            // Count total supports for this petition
            const supportCount = await payload.count({
              collection: 'petition-supports',
              where: {
                petition: {
                  equals: petitionId,
                },
              },
            })

            // Update the petition's supporter count
            await payload.update({
              collection: 'petitions',
              id: petitionId,
              data: {
                supporterCount: supportCount.totalDocs,
              },
            })
          } catch (error) {
            console.error('Error updating petition supporter count:', error)
          }
        }
        return doc
      },
    ],
  },
  timestamps: true,
}
