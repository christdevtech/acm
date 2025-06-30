import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, PaginatedDocs, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectHero } from '@/heros/ProjectHero'
import { RenderProjectBlocks } from '@/blocks/RenderProjectBlocks'
import { FundingCard } from '@/components/FundingCard'
// import { FundingCard } from '@/components/FundingCard'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects: PaginatedDocs = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = projects.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Project({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/projects/' + slug

  const project: RequiredDataFromCollectionSlug<'projects'> | null = await queryProjectBySlug({
    slug,
  })

  if (!project) {
    return <PayloadRedirects url={url} />
  }

  const { description } = project

  return (
    <article className="pb-24">
      <PageClient />
      {/* Allows redirects for valid projects too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ProjectHero project={project} />

      {/* Project content with funding card */}
      <div className="container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - takes 2/3 on large screens */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {description && <RenderProjectBlocks blocks={description} />}
          </div>

          {/* Funding card - takes 1/3 on large screens, appears first on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2 lg:-mt-16">
            <FundingCard project={project} />
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const project = await queryProjectBySlug({
    slug,
  })

  return generateMeta({ doc: project })
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
