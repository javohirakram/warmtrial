import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface VibeCheckRequest {
  matchId: string
  videoUrl?: string
  responses: Record<string, string>
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

    const { matchId, videoUrl, responses }: VibeCheckRequest = await request.json()

    if (!matchId || !responses) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the match exists and get candidate info
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { candidate: true }
    })

    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      )
    }

    // Create the vibe check record
    const vibeCheck = await prisma.vibeCheck.create({
      data: {
        matchId,
        candidateId: match.candidateId,
        videoUrl: videoUrl || null,
        responses,
        status: "COMPLETED"
      }
    })

    // Update match status
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "VIBE_CHECK_COMPLETED" }
    })

    return NextResponse.json({
      success: true,
      vibeCheckId: vibeCheck.id,
      message: "Vibe check submitted successfully"
    })

  } catch (error) {
    console.error("Error submitting vibe check:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    if (!matchId) {
      return NextResponse.json(
        { error: "Match ID is required" },
        { status: 400 }
      )
    }

    // Get vibe check for the match
    const vibeCheck = await prisma.vibeCheck.findFirst({
      where: { matchId },
      include: {
        match: {
          include: {
            candidate: true,
            role: true
          }
        }
      }
    })

    if (!vibeCheck) {
      return NextResponse.json(
        { error: "Vibe check not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ vibeCheck })

  } catch (error) {
    console.error("Error fetching vibe check:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}