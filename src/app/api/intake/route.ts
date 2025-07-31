import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FounderIntakeData } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      )
    }

    const data: FounderIntakeData = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.skillsRequired || data.skillsRequired.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create the role in the database
    const role = await prisma.role.create({
      data: {
        title: data.title,
        description: data.description,
        skillsRequired: data.skillsRequired,
        workingStyle: data.workingStyle,
        timeZone: data.timeZone,
        cultureFit: data.cultureFit,
        urgency: data.urgency,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        equityMin: data.equityMin,
        equityMax: data.equityMax,
        founderId: session.user.id,
      },
    })

    // TODO: Trigger matching algorithm here
    // For now, we'll just return the role ID
    
    return NextResponse.json({
      success: true,
      roleId: role.id,
      message: "Role created successfully"
    })

  } catch (error) {
    console.error("Error creating role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}