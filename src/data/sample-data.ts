import { BenchmarkData } from "@/types"

export const sampleBenchmarkData: BenchmarkData[] = [
  // Software Engineer roles
  {
    role: "Software Engineer",
    level: "Junior",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 90000 * 100, // Convert to cents
    salaryMax: 120000 * 100,
    equityMin: 0.1,
    equityMax: 0.5
  },
  {
    role: "Software Engineer",
    level: "Mid",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 120000 * 100,
    salaryMax: 160000 * 100,
    equityMin: 0.05,
    equityMax: 0.25
  },
  {
    role: "Software Engineer",
    level: "Senior",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 160000 * 100,
    salaryMax: 220000 * 100,
    equityMin: 0.05,
    equityMax: 0.15
  },
  {
    role: "Software Engineer",
    level: "Junior",
    location: "Remote",
    companyStage: "Seed",
    salaryMin: 70000 * 100,
    salaryMax: 95000 * 100,
    equityMin: 0.1,
    equityMax: 0.5
  },
  {
    role: "Software Engineer",
    level: "Mid",
    location: "Remote",
    companyStage: "Seed",
    salaryMin: 95000 * 100,
    salaryMax: 130000 * 100,
    equityMin: 0.05,
    equityMax: 0.25
  },
  {
    role: "Software Engineer",
    level: "Senior",
    location: "Remote",
    companyStage: "Seed",
    salaryMin: 130000 * 100,
    salaryMax: 180000 * 100,
    equityMin: 0.05,
    equityMax: 0.15
  },
  // Product Manager roles
  {
    role: "Product Manager",
    level: "Junior",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 110000 * 100,
    salaryMax: 140000 * 100,
    equityMin: 0.1,
    equityMax: 0.4
  },
  {
    role: "Product Manager",
    level: "Mid",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 140000 * 100,
    salaryMax: 180000 * 100,
    equityMin: 0.05,
    equityMax: 0.2
  },
  {
    role: "Product Manager",
    level: "Senior",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 180000 * 100,
    salaryMax: 250000 * 100,
    equityMin: 0.05,
    equityMax: 0.1
  },
  // Designer roles
  {
    role: "Product Designer",
    level: "Junior",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 85000 * 100,
    salaryMax: 115000 * 100,
    equityMin: 0.1,
    equityMax: 0.4
  },
  {
    role: "Product Designer",
    level: "Mid",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 115000 * 100,
    salaryMax: 150000 * 100,
    equityMin: 0.05,
    equityMax: 0.2
  },
  {
    role: "Product Designer",
    level: "Senior",
    location: "San Francisco",
    companyStage: "Seed",
    salaryMin: 150000 * 100,
    salaryMax: 200000 * 100,
    equityMin: 0.05,
    equityMax: 0.15
  },
  // Series A adjustments (generally 20-30% higher)
  {
    role: "Software Engineer",
    level: "Senior",
    location: "San Francisco",
    companyStage: "Series A",
    salaryMin: 180000 * 100,
    salaryMax: 250000 * 100,
    equityMin: 0.01,
    equityMax: 0.05
  },
  {
    role: "Product Manager",
    level: "Senior",
    location: "San Francisco",
    companyStage: "Series A",
    salaryMin: 200000 * 100,
    salaryMax: 280000 * 100,
    equityMin: 0.01,
    equityMax: 0.04
  }
]

export const mockCandidates = [
  {
    id: "candidate-1",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    summary: "Full-stack engineer with 5+ years experience building scalable web applications. Previously at two successful startups, passionate about clean architecture and user experience.",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS", "GraphQL"],
    experience: "Senior Software Engineer at TechCorp (2021-2024), Full-stack Developer at StartupXYZ (2019-2021), Software Engineer at BigTech (2019-2019)",
    location: "San Francisco, CA",
    timeZone: "PST",
    portfolioUrl: "https://alexchen.dev",
    linkedinUrl: "https://linkedin.com/in/alexchen",
    githubUrl: "https://github.com/alexchen",
    availability: "full-time",
    expectedSalary: 165000,
    matchScore: 0.89
  },
  {
    id: "candidate-2", 
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    summary: "Product designer with expertise in early-stage product development and user research. Led design for 3 successful product launches, strong in both UX and visual design.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "A/B Testing", "Webflow"],
    experience: "Senior Product Designer at DesignCo (2022-2024), Product Designer at GrowthStartup (2020-2022), UX Designer at DigitalAgency (2019-2020)",
    location: "Austin, TX",
    timeZone: "CST",
    portfolioUrl: "https://sarahjohnson.design",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    githubUrl: null,
    availability: "full-time",
    expectedSalary: 125000,
    matchScore: 0.92
  },
  {
    id: "candidate-3",
    name: "Marcus Rodriguez",
    email: "marcus.r@example.com", 
    summary: "Product manager with deep experience in B2B SaaS and marketplace products. Strong analytical background with experience scaling products from 0 to $10M ARR.",
    skills: ["Product Strategy", "SQL", "Analytics", "A/B Testing", "Roadmapping", "Stakeholder Management"],
    experience: "Senior PM at ScaleUp (2021-2024), Product Manager at DataCorp (2019-2021), Business Analyst at ConsultingFirm (2017-2019)",
    location: "Remote",
    timeZone: "EST",
    portfolioUrl: "https://marcus-pm.com",
    linkedinUrl: "https://linkedin.com/in/marcusrodriguez",
    githubUrl: null,
    availability: "full-time",
    expectedSalary: 155000,
    matchScore: 0.85
  },
  {
    id: "candidate-4",
    name: "Emily Park",
    email: "emily.park@example.com",
    summary: "DevOps engineer specialized in cloud infrastructure and CI/CD pipelines. Experience with high-scale systems serving millions of users.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Python", "Monitoring"],
    experience: "Senior DevOps Engineer at CloudTech (2020-2024), Infrastructure Engineer at HighScale (2018-2020), Systems Admin at TechServices (2017-2018)",
    location: "Seattle, WA", 
    timeZone: "PST",
    portfolioUrl: "https://emilypark.dev",
    linkedinUrl: "https://linkedin.com/in/emilypark",
    githubUrl: "https://github.com/emilypark",
    availability: "full-time",
    expectedSalary: 145000,
    matchScore: 0.78
  },
  {
    id: "candidate-5",
    name: "David Kim",
    email: "david.kim@example.com",
    summary: "Frontend specialist with strong React and TypeScript skills. Experience building complex user interfaces and design systems at scale.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Storybook", "Jest"],
    experience: "Senior Frontend Engineer at UITech (2021-2024), Frontend Developer at WebAgency (2019-2021), Junior Developer at StartupABC (2018-2019)",
    location: "New York, NY",
    timeZone: "EST", 
    portfolioUrl: "https://davidkim.dev",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    githubUrl: "https://github.com/davidkim",
    availability: "contract",
    expectedSalary: 140000,
    matchScore: 0.83
  }
]

export const sampleTrialTemplates = [
  {
    title: "Frontend Component Implementation",
    description: "Build a reusable React component based on provided designs",
    requirements: "Implement a responsive dashboard card component with TypeScript, including hover states and loading indicators",
    deliverables: "Working component code, Storybook stories, unit tests, and documentation",
    timeline: "3 days",
    fee: 50000 // $500 in cents
  },
  {
    title: "API Integration & Testing",
    description: "Integrate with third-party API and write comprehensive tests",
    requirements: "Connect to REST API, handle errors gracefully, implement caching strategy",
    deliverables: "API integration code, error handling, test suite, and documentation",
    timeline: "2 days", 
    fee: 40000 // $400 in cents
  },
  {
    title: "Database Schema Design",
    description: "Design and implement database schema for new feature",
    requirements: "Create efficient schema for user analytics, including proper indexing and relationships",
    deliverables: "Migration files, schema documentation, and performance analysis",
    timeline: "2 days",
    fee: 45000 // $450 in cents
  },
  {
    title: "User Research & Wireframes",
    description: "Conduct user interviews and create initial wireframes",
    requirements: "Interview 5 users, synthesize findings, create wireframes for mobile app feature",
    deliverables: "Research summary, user personas, wireframes, and recommendations",
    timeline: "4 days",
    fee: 60000 // $600 in cents
  }
]