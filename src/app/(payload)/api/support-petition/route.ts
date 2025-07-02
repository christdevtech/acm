import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface SupportPetitionRequest {
  petitionId: string
  location?: {
    country?: string
    region?: string
    city?: string
    latitude?: number
    longitude?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body: SupportPetitionRequest = await request.json()

    if (!body.petitionId) {
      return NextResponse.json({ error: 'Petition ID is required' }, { status: 400 })
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded?.split(',')[0] || realIp || 'unknown'

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check if this IP has already supported this petition
    const existingSupport = await payload.find({
      collection: 'petition-supports',
      where: {
        and: [
          {
            petition: {
              equals: body.petitionId,
            },
          },
          {
            ipAddress: {
              equals: clientIp,
            },
          },
        ],
      },
    })

    if (existingSupport.docs.length > 0) {
      return NextResponse.json(
        { error: 'You have already supported this petition' },
        { status: 409 },
      )
    }

    // Verify petition exists
    const petition = await payload.findByID({
      collection: 'petitions',
      id: body.petitionId,
    })

    if (!petition) {
      return NextResponse.json({ error: 'Petition not found' }, { status: 404 })
    }

    // Create support record
    const support = await payload.create({
      collection: 'petition-supports',
      data: {
        petition: body.petitionId,
        ipAddress: clientIp,
        userAgent,
        location: body.location || {},
      },
    })

    // Get Updated count
    const petitionSupports = await payload.find({
      collection: 'petition-supports',
      where: {
        petition: {
          equals: body.petitionId,
        },
      },
    })

    const updatedPetition = await payload.update({
      collection: 'petitions',
      id: body.petitionId,
      data: {
        supporterCount: petitionSupports.docs.length,
      },
    })

    return NextResponse.json({
      success: true,
      supportId: support.id,
      supporterCount: updatedPetition.supporterCount,
      message: 'Thank you for your support!',
    })
  } catch (error) {
    console.error('Error supporting petition:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
