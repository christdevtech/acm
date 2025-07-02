import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const petitionId = searchParams.get('petitionId')

    if (!petitionId) {
      return NextResponse.json({ error: 'Petition ID is required' }, { status: 400 })
    }

    // Check for existing support cookie
    const cookieStore = await cookies()
    const supportCookieName = `petition_support_${petitionId}`
    const existingCookie = cookieStore.get(supportCookieName)

    return NextResponse.json({
      hasSupported: !!existingCookie,
      petitionId
    })
  } catch (error) {
    console.error('Error checking petition support:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}