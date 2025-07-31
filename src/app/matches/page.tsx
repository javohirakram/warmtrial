"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, DollarSign, Star, ExternalLink, Video, Github, Linkedin } from "lucide-react"

interface Match {
  id: string
  matchScore: number
  status: string
  candidate: {
    id: string
    name: string
    summary: string
    skills: string[]
    location: string
    timeZone: string
    experience: string
    expectedSalary?: number
    portfolioUrl?: string
    linkedinUrl?: string
    githubUrl?: string
    availability: string
  }
  role: {
    id: string
    title: string
    description: string
  }
}

export default function MatchesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleId = searchParams.get("roleId")
  
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!roleId || !session) return

    fetchMatches()
  }, [roleId, session])

  const fetchMatches = async () => {
    try {
      const response = await fetch(`/api/match?roleId=${roleId}`)
      const data = await response.json()
      
      if (data.matches && data.matches.length > 0) {
        setMatches(data.matches)
      } else {
        // Generate matches if none exist
        generateMatches()
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMatches = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roleId }),
      })
      
      const data = await response.json()
      if (data.matches) {
        setMatches(data.matches)
      }
    } catch (error) {
      console.error("Error generating matches:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const startVibeCheck = (matchId: string) => {
    router.push(`/vibe-check/${matchId}`)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-100"
    if (score >= 0.6) return "text-blue-600 bg-blue-100"
    if (score >= 0.4) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h2>
          <Link href="/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading || isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {isGenerating ? "Finding Perfect Candidates..." : "Loading Matches..."}
            </h1>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              {isGenerating ? "AI is analyzing your requirements and matching candidates..." : "Loading..."}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Matches</h1>
          <p className="text-gray-600 mt-2">
            We found {matches.length} great candidates for{" "}
            {matches[0]?.role?.title && (
              <span className="font-semibold">{matches[0].role.title}</span>
            )}
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any candidates matching your requirements at the moment.
            </p>
            <button
              onClick={generateMatches}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {match.candidate.name}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(match.matchScore)}`}>
                        <Star className="h-3 w-3 inline mr-1" />
                        {Math.round(match.matchScore * 100)}% match
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {match.candidate.location} • {match.candidate.timeZone}
                      </div>
                      {match.candidate.expectedSalary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(match.candidate.expectedSalary)}
                        </div>
                      )}
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                        {match.candidate.availability}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {match.candidate.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.candidate.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {match.candidate.skills.length > 6 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{match.candidate.skills.length - 6} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {match.candidate.portfolioUrl && (
                        <a
                          href={match.candidate.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Portfolio
                        </a>
                      )}
                      {match.candidate.linkedinUrl && (
                        <a
                          href={match.candidate.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                      {match.candidate.githubUrl && (
                        <a
                          href={match.candidate.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => startVibeCheck(match.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Video className="h-4 w-4" />
                      Start Vibe Check
                    </button>
                    
                    {match.status !== "PENDING" && (
                      <div className="text-xs text-gray-500 text-center">
                        Status: {match.status.toLowerCase().replace(/_/g, " ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience Preview */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {match.candidate.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Not seeing the right candidates? Try adjusting your requirements.
            </p>
            <Link
              href="/intake"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Post Another Role
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}