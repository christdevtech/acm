import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { Banner } from '../blocks/Banner/config'
import { Code } from '../blocks/Code/config'
import { MediaBlock } from '../blocks/MediaBlock/config'

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    create: anyone, // Allow anyone to create comments
    delete: authenticated,
    read: ({ req }) => {
      // Only show approved comments to non-authenticated users
      if (req.user) {
        return true // Authenticated users can see all comments
      }
      return {
        status: {
          equals: 'approved',
        },
      }
    },
    update: authenticated,
  },
  admin: {
    defaultColumns: ['content', 'authorName', 'status', 'parentType', 'createdAt'],
    useAsTitle: 'content',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      required: true,
      admin: {
        description: 'The comment content',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the comment author',
      },
    },
    {
      name: 'authorEmail',
      type: 'email',
      admin: {
        description: 'Email of the comment author (not displayed publicly)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'parentType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Petition',
          value: 'petitions',
        },
        {
          label: 'Post',
          value: 'posts',
        },
        {
          label: 'Project',
          value: 'projects',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Type of content this comment is attached to',
      },
    },
    {
      name: 'parentId',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'ID of the content this comment is attached to',
      },
    },
    {
      name: 'petition',
      type: 'relationship',
      relationTo: 'petitions',
      admin: {
        condition: (data) => data.parentType === 'petitions',
        position: 'sidebar',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        condition: (data) => data.parentType === 'posts',
        position: 'sidebar',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        condition: (data) => data.parentType === 'projects',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // Set the appropriate relationship based on parentType
          if (data.parentType && data.parentId) {
            switch (data.parentType) {
              case 'petitions':
                data.petition = data.parentId
                break
              case 'posts':
                data.post = data.parentId
                break
              case 'projects':
                data.project = data.parentId
                break
            }
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}
