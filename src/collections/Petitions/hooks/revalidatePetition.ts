import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidate } from '@/utilities/revalidate'

export const revalidatePetition: CollectionAfterChangeHook = ({ doc, req }) => {
  // Always revalidate since draft functionality is disabled
  revalidate({ collection: 'petitions', doc, req })

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidate({ collection: 'petitions', doc, req })

  return doc
}
