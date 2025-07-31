import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface OfferData {
  title: string
  type: "CONTRACT" | "FULL_TIME"
  salary?: number
  hourlyRate?: number
  equity?: number
  vestingSchedule?: string
  benefits: string[]
  responsibilities: string
  startDate?: string
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    const { trialId, offerData }: { trialId: string, offerData: OfferData } = await request.json()

    if (!trialId || !offerData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get trial and related data
    const trial = await prisma.trial.findUnique({
      where: { id: trialId },
      include: {
        candidate: true,
        founder: true,
        match: {
          include: { role: true }
        }
      }
    })

    if (!trial || trial.founderId !== session.user.id) {
      return NextResponse.json(
        { error: "Trial not found or unauthorized" },
        { status: 404 }
      )
    }

    // Create offer record in database
    const offer = await prisma.offer.create({
      data: {
        title: offerData.title,
        type: offerData.type,
        salary: offerData.salary ? offerData.salary * 100 : null, // Convert to cents
        hourlyRate: offerData.hourlyRate ? offerData.hourlyRate * 100 : null, // Convert to cents
        equity: offerData.equity,
        vestingSchedule: offerData.vestingSchedule,
        benefits: offerData.benefits,
        responsibilities: offerData.responsibilities,
        startDate: offerData.startDate ? new Date(offerData.startDate) : null,
        status: "SENT",
        trialId,
        matchId: trial.matchId,
        founderId: session.user.id
      }
    })

    // Update trial status
    await prisma.trial.update({
      where: { id: trialId },
      data: { status: "COMPLETED" }
    })

    // Update match status
    await prisma.match.update({
      where: { id: trial.matchId },
      data: { status: "OFFER_SENT" }
    })

    // TODO: Send email notification to candidate
    // In a real implementation, you would integrate with an email service like SendGrid, Resend, etc.
    console.log(`Offer sent to ${trial.candidate.email} for position: ${offerData.title}`)

    return NextResponse.json({
      success: true,
      offerId: offer.id,
      message: "Offer sent successfully"
    })

  } catch (error) {
    console.error("Error sending offer:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}