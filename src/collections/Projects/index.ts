import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

// import { authenticated } from '../access/authenticated'
// import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
// import { Banner } from '../blocks/Banner/config'
// import { Code } from '../blocks/Code/config'
// import { MediaBlock } from '../blocks/MediaBlock/config'
// import { CallToAction } from '../blocks/CallToAction/config'
// import { Content } from '../blocks/Content/config'
// import { FormBlock } from '../blocks/Form/config'
// import { Archive } from '../blocks/ArchiveBlock/config'
// import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { slugField } from '@/fields/slug'
// import { populatePublishedAt } from '../hooks/populatePublishedAt'
import { calculateTotalDonated } from './hooks/calculateTotalDonated'
import { revalidateProject, revalidateDelete } from './hooks/revalidateProject'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Content } from '@/blocks/Content/config'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    targetAmount: true,
    totalDonated: true,
    status: true,
    location: true,
    dueDate: true,
  },
  admin: {
    defaultColumns: ['title', 'status', 'targetAmount', 'totalDonated', 'dueDate', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'projects',
          req,
        })
        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'projects',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Image',
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock, CallToAction, Content] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Project Description',
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'targetAmount',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Target funding amount in USD',
              },
            },
            {
              name: 'totalDonated',
              type: 'number',
              defaultValue: 0,
              min: 0,
              admin: {
                description: 'Total amount donated (automatically calculated)',
                readOnly: true,
              },
            },
            {
              name: 'dueDate',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
                description: 'Project completion deadline',
              },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'planning',
              required: true,
              options: [
                {
                  label: 'Planning',
                  value: 'planning',
                },
                {
                  label: 'Active',
                  value: 'active',
                },
                {
                  label: 'Funded',
                  value: 'funded',
                },
                {
                  label: 'In Progress',
                  value: 'in_progress',
                },
                {
                  label: 'Executed',
                  value: 'executed',
                },
                {
                  label: 'Completed',
                  value: 'completed',
                },
                {
                  label: 'Cancelled',
                  value: 'cancelled',
                },
                {
                  label: 'On Hold',
                  value: 'on_hold',
                },
              ],
            },
            {
              name: 'location',
              type: 'relationship',
              relationTo: 'locations',
              required: true,
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              admin: {
                description: 'Project tags for categorization',
              },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              admin: {
                description: 'Related blog posts about this project',
              },
            },
          ],
          label: 'Project Details',
        },
        {
          fields: [
            {
              name: 'executionResults',
              type: 'group',
              admin: {
                condition: (_, siblingData) =>
                  ['executed', 'in_progress', 'on_hold', 'funded'].includes(siblingData?.status),
                description: 'Results and documentation of project execution',
              },
              fields: [
                {
                  name: 'summary',
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                        BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        HorizontalRuleFeature(),
                      ]
                    },
                  }),
                  label: 'Execution Summary',
                },
                {
                  name: 'youtubeVideos',
                  type: 'array',
                  label: 'YouTube Videos',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'videoId',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'YouTube video ID (e.g., dQw4w9WgXcQ)',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                    },
                  ],
                },
                {
                  name: 'mediaGallery',
                  type: 'array',
                  label: 'Media Gallery',
                  fields: [
                    {
                      name: 'media',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                    },
                  ],
                },
                {
                  name: 'impactMetrics',
                  type: 'array',
                  label: 'Impact Metrics',
                  fields: [
                    {
                      name: 'metric',
                      type: 'text',
                      required: true,
                      label: 'Metric Name',
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      label: 'Value',
                    },
                    {
                      name: 'unit',
                      type: 'text',
                      label: 'Unit (e.g., people, schools, etc.)',
                    },
                  ],
                },
                {
                  name: 'testimonials',
                  type: 'array',
                  label: 'Testimonials',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Person Name',
                    },
                    {
                      name: 'role',
                      type: 'text',
                      label: 'Role/Title',
                    },
                    {
                      name: 'quote',
                      type: 'textarea',
                      required: true,
                    },
                    {
                      name: 'photo',
                      type: 'upload',
                      relationTo: 'media',
                    },
                  ],
                },
              ],
            },
          ],
          label: 'Execution Results',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'donations',
      type: 'relationship',
      relationTo: 'donations',
      hasMany: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [calculateTotalDonated, revalidateProject],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
