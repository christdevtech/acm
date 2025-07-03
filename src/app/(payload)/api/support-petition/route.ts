import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

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

    // Check for existing support via cookie first
    const cookieStore = await cookies()
    const supportCookieName = `petition_support_${body.petitionId}`
    const existingCookie = cookieStore.get(supportCookieName)

    if (existingCookie) {
      return NextResponse.json(
        { error: 'Already supported', message: 'You have already supported this petition' },
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

    // Create response with success data
    const response = NextResponse.json({
      success: true,
      supportId: support.id,
      supporterCount: updatedPetition.supporterCount,
      message: 'Thank you for your support!',
    })

    // Set cookie to prevent duplicate support
    response.cookies.set(supportCookieName, 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error supporting petition:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
