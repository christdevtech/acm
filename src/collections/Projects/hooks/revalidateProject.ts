import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Project } from '../../../payload-types'

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/projects/${doc.slug}`

      payload.logger.info(`Revalidating project at path: ${path}`)

      revalidatePath(path)
      revalidateTag('projects-sitemap')
      revalidateTag('projects-archive')
    }

    // If the project was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/projects/${previousDoc.slug}`

      payload.logger.info(`Revalidating old project at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('projects-sitemap')
      revalidateTag('projects-archive')
    }

    // Revalidate projects archive page when project status changes
    if (previousDoc?.status !== doc.status) {
      revalidatePath('/projects')
      revalidateTag('projects-archive')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Project> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/projects/${doc?.slug}`

    revalidatePath(path)
    revalidatePath('/projects') // Revalidate projects archive
    revalidateTag('projects-sitemap')
    revalidateTag('projects-archive')
  }

  return doc
}