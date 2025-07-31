import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      type: "FOUNDER" | "CANDIDATE"
    } & DefaultSession["user"]
  }
}

export interface FounderIntakeData {
  title: string
  description: string
  skillsRequired: string[]
  workingStyle: "remote" | "hybrid" | "onsite"
  timeZone: string
  cultureFit: string
  urgency: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  salaryMin?: number
  salaryMax?: number
  equityMin?: number
  equityMax?: number
}

export interface CandidateProfile {
  name: string
  email: string
  summary: string
  skills: string[]
  experience: string
  location: string
  timeZone: string
  portfolioUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  availability: "full-time" | "part-time" | "contract"
  expectedSalary?: number
}

export interface VibeCheckData {
  videoUrl?: string
  responses: Record<string, string>
}

export interface TrialData {
  title: string
  description: string
  requirements: string
  deliverables: string
  timeline: string
  fee: number
}

export interface BenchmarkData {
  role: string
  level: string
  location: string
  companyStage: string
  salaryMin: number
  salaryMax: number
  equityMin: number
  equityMax: number
}

export interface MatchWithDetails {
  id: string
  matchScore: number
  status: string
  candidate: {
    id: string
    name: string
    summary: string
    skills: string[]
    location: string
    expectedSalary?: number
  }
  role: {
    id: string
    title: string
    description: string
  }
}