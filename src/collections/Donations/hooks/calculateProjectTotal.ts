import type { BasePayload, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Project, Donation } from '../../../payload-types'

// Comprehensive hook to recalculate project totals when donations change
export const recalculateProjectTotalOnDonationChange: CollectionAfterChangeHook<Donation> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  try {
    // Determine which projects need recalculation
    const projectsToUpdate = new Set<string>()

    // Current project (if exists)
    if (doc.project) {
      const currentProjectId = typeof doc.project === 'object' ? doc.project.id : doc.project
      projectsToUpdate.add(currentProjectId)
    }

    // Previous project (if donation was moved between projects)
    if (previousDoc?.project && previousDoc.project !== doc.project) {
      const previousProjectId =
        typeof previousDoc.project === 'object' ? previousDoc.project.id : previousDoc.project
      projectsToUpdate.add(previousProjectId)
    }

    // Check if recalculation is needed
    const needsRecalculation =
      // New donation
      !previousDoc ||
      // Status changed
      doc.status !== previousDoc.status ||
      // Amount changed
      doc.amount !== previousDoc.amount ||
      // Project changed
      doc.project !== previousDoc.project

    if (!needsRecalculation || projectsToUpdate.size === 0) {
      return doc
    }

    // Recalculate totals for affected projects
    for (const projectId of projectsToUpdate) {
      await recalculateProjectTotal(projectId, payload)
    }
  } catch (error) {
    payload.logger.error(`Error recalculating project total on donation change: ${error}`)
  }

  return doc
}

// Hook to recalculate project totals when a donation is deleted
export const recalculateProjectTotalOnDonationDelete: CollectionAfterDeleteHook<Donation> = async ({
  doc,
  req: { payload },
}) => {
  try {
    if (doc.project && doc.status === 'completed') {
      const projectId = typeof doc.project === 'object' ? doc.project.id : doc.project
      await recalculateProjectTotal(projectId, payload)
    }
  } catch (error) {
    payload.logger.error(`Error recalculating project total on donation deletion: ${error}`)
  }

  return doc
}

// Utility function to recalculate project total
const recalculateProjectTotal = async (projectId: string, payload: BasePayload) => {
  try {
    // Get all completed donations for this project
    const donations = await payload.find({
      collection: 'donations',
      where: {
        and: [
          {
            project: {
              equals: projectId,
            },
          },
          {
            status: {
              equals: 'completed',
            },
          },
        ],
      },
      limit: 5000, // Adjust based on expected donation volume
    })

    // Calculate total donated amount
    const totalDonated = donations.docs.reduce((sum, donation) => {
      return sum + (donation.amount || 0)
    }, 0)

    // Get donation IDs for the relationship field
    const donationIds = donations.docs.map((donation) => {
      if (typeof donation === 'string') {
        return donation
      }
      return donation.id
    })

    // Get current project to check if update is needed
    const currentProject = await payload.findByID({
      collection: 'projects',
      id: projectId,
    })

    // Only update if the total has changed
    if (currentProject && currentProject.totalDonated !== totalDonated) {
      await payload.update({
        collection: 'projects',
        id: projectId,
        data: {
          totalDonated,
          donations: donationIds,
        },
        context: {
          skipHooks: true, // Prevent infinite loop
        },
      })

      payload.logger.info(`Updated project ${projectId} total donated: ${totalDonated}`)
    }
  } catch (error) {
    payload.logger.error(`Error in recalculateProjectTotal for project ${projectId}: ${error}`)
    throw error
  }
}
