import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Project, Donation } from '../../../payload-types'

// Hook to calculate total donated amount for a project
export const calculateTotalDonated: CollectionAfterChangeHook<Project> = async ({
  doc,
  req: { payload },
}) => {
  try {
    // Get all completed donations for this project
    const donations = await payload.find({
      collection: 'donations',
      where: {
        and: [
          {
            project: {
              equals: doc.id,
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

    const newDonations = donations.docs.map((donation) => {
      if (typeof donation === 'string') {
        return donation
      }
      return donation.id
    })

    // Calculate total donated amount
    const totalDonated = donations.docs.reduce((sum, donation) => {
      return sum + (donation.amount || 0)
    }, 0)

    // Update the project with the calculated total
    if (doc.totalDonated !== totalDonated) {
      await payload.update({
        collection: 'projects',
        id: doc.id,
        data: {
          totalDonated,
          donations: newDonations,
        },
        context: {
          skipHooks: true, // Prevent infinite loop
        },
      })
    }
  } catch (error) {
    payload.logger.error(`Error calculating total donated for project ${doc.id}: ${error}`)
  }

  return doc
}

// Hook to trigger project recalculation when donation status changes
export const triggerProjectRecalculation: CollectionAfterChangeHook<Donation> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc.status === 'completed' && previousDoc?.status !== 'completed') {
    // New completed donation - trigger project recalculation
    if (doc.project) {
      try {
        const project = await payload.findByID({
          collection: 'projects',
          id: typeof doc.project === 'object' ? doc.project.id : doc.project,
        })

        if (project) {
          await payload.update({
            collection: 'projects',
            id: project.id,
            data: {
              updatedAt: new Date().toISOString(),
            },
          })
        }
      } catch (error) {
        payload.logger.error(`Error triggering project recalculation: ${error}`)
      }
    }
  }
  return doc
}

// Hook to recalculate project totals when a donation is deleted
export const recalculateProjectTotal: CollectionAfterDeleteHook<Donation> = async ({
  doc,
  req: { payload },
}) => {
  if (doc.project && doc.status === 'completed') {
    try {
      // Get the project
      const project = await payload.findByID({
        collection: 'projects',
        id: typeof doc.project === 'object' ? doc.project.id : doc.project,
      })

      if (project) {
        // Trigger recalculation by updating the project
        await payload.update({
          collection: 'projects',
          id: project.id,
          data: {
            // Just update updatedAt to trigger the hook
            updatedAt: new Date().toISOString(),
          },
        })
      }
    } catch (error) {
      payload.logger.error(`Error recalculating project total after donation deletion: ${error}`)
    }
  }

  return doc
}
