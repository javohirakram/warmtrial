import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"
import { mockCandidates } from "@/data/sample-data"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface MatchRequest {
  roleId: string
}

// Mock function to simulate AI matching
async function generateMatches(roleId: string) {
  try {
    // Get the role details
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: { founder: true }
    })

    if (!role) {
      throw new Error("Role not found")
    }

    // For now, we'll use a simple scoring algorithm based on skill overlap
    // In production, this would use OpenAI embeddings for semantic matching
    const candidateMatches = mockCandidates.map(candidate => {
      const roleSkills = Array.isArray(role.skillsRequired) 
        ? role.skillsRequired 
        : JSON.parse(role.skillsRequired as string)
      
      const candidateSkills = candidate.skills
      
      // Calculate skill overlap score
      const commonSkills = roleSkills.filter((skill: string) => 
        candidateSkills.some(candidateSkill => 
          candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(candidateSkill.toLowerCase())
        )
      )
      
      const skillScore = commonSkills.length / Math.max(roleSkills.length, candidateSkills.length)
      
      // Add some randomness to simulate AI scoring
      const aiScore = Math.random() * 0.3 + skillScore * 0.7
      
      // Boost score based on salary alignment
      let salaryScore = 0.5 // neutral
      if (role.salaryMin && role.salaryMax && candidate.expectedSalary) {
        if (candidate.expectedSalary >= role.salaryMin && candidate.expectedSalary <= role.salaryMax) {
          salaryScore = 1.0 // perfect match
        } else if (candidate.expectedSalary <= role.salaryMax * 1.1) {
          salaryScore = 0.8 // close match
        }
      }
      
      const finalScore = (aiScore * 0.7) + (salaryScore * 0.3)
      
      return {
        candidateId: candidate.id,
        matchScore: Math.min(finalScore, 1.0),
        candidate
      }
    })

    // Sort by match score and take top 5
    const topMatches = candidateMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)

    // Create match records in the database
    const matches = await Promise.all(
      topMatches.map(async (match) => {
        // First, ensure the candidate exists in our database
        let candidate = await prisma.candidate.findUnique({
          where: { id: match.candidateId }
        })

        if (!candidate) {
          // Create a user first
          const user = await prisma.user.create({
            data: {
              email: match.candidate.email,
              name: match.candidate.name,
              type: "CANDIDATE"
            }
          })

          // Then create the candidate profile
          candidate = await prisma.candidate.create({
            data: {
              id: match.candidateId,
              name: match.candidate.name,
              email: match.candidate.email,
              summary: match.candidate.summary,
              skills: match.candidate.skills,
              experience: match.candidate.experience,
              location: match.candidate.location,
              timeZone: match.candidate.timeZone,
              portfolioUrl: match.candidate.portfolioUrl,
              linkedinUrl: match.candidate.linkedinUrl,
              githubUrl: match.candidate.githubUrl,
              availability: match.candidate.availability,
              expectedSalary: match.candidate.expectedSalary,
              userId: user.id
            }
          })
        }

        // Create the match record
        return prisma.match.create({
          data: {
            roleId: role.id,
            candidateId: match.candidateId,
            founderId: role.founderId,
            matchScore: match.matchScore,
            status: "PENDING"
          },
          include: {
            candidate: true,
            role: true
          }
        })
      })
    )

    return matches
  } catch (error) {
    console.error("Error generating matches:", error)
    throw error
  }
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

    const { roleId }: MatchRequest = await request.json()

    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      )
    }

    // Check if matches already exist for this role
    const existingMatches = await prisma.match.findMany({
      where: { roleId },
      include: {
        candidate: true,
        role: true
      }
    })

    if (existingMatches.length > 0) {
      return NextResponse.json({
        matches: existingMatches,
        message: "Using existing matches"
      })
    }

    // Generate new matches
    const matches = await generateMatches(roleId)

    return NextResponse.json({
      matches,
      message: "Matches generated successfully"
    })

  } catch (error) {
    console.error("Error in match API:", error)
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
    const roleId = searchParams.get("roleId")

    if (!roleId) {
      return NextResponse.json(
        { error: "Role ID is required" },
        { status: 400 }
      )
    }

    // Get existing matches for the role
    const matches = await prisma.match.findMany({
      where: { 
        roleId,
        founderId: session.user.id
      },
      include: {
        candidate: true,
        role: true
      },
      orderBy: {
        matchScore: 'desc'
      }
    })

    return NextResponse.json({ matches })

  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}