"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X, Clock, MapPin, Users, Zap } from "lucide-react"
import { FounderIntakeData } from "@/types"

const skillOptions = [
  "React", "Vue.js", "Angular", "JavaScript", "TypeScript", "Node.js", "Python", "Java",
  "Go", "Rust", "PHP", "Ruby", "C#", ".NET", "PostgreSQL", "MySQL", "MongoDB", "Redis",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "GraphQL", "REST APIs", "microservices",
  "DevOps", "CI/CD", "Machine Learning", "Data Science", "Product Management", "UX Design",
  "UI Design", "Figma", "Adobe Creative Suite", "Marketing", "Sales", "Content Writing",
  "SEO", "Social Media", "Customer Success", "Business Development", "Finance", "Legal"
]

const urgencyOptions = [
  { value: "LOW", label: "Low - 1-2 months", icon: Clock, color: "text-gray-600", bgColor: "bg-gray-100" },
  { value: "MEDIUM", label: "Medium - 2-4 weeks", icon: Clock, color: "text-blue-600", bgColor: "bg-blue-100" },
  { value: "HIGH", label: "High - 1-2 weeks", icon: Zap, color: "text-orange-600", bgColor: "bg-orange-100" },
  { value: "URGENT", label: "Urgent - ASAP", icon: Zap, color: "text-red-600", bgColor: "bg-red-100" }
] as const

export default function IntakePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSkill, setCurrentSkill] = useState("")
  const [formData, setFormData] = useState<FounderIntakeData>({
    title: "",
    description: "",
    skillsRequired: [],
    workingStyle: "remote",
    timeZone: "",
    cultureFit: "",
    urgency: "MEDIUM",
    salaryMin: undefined,
    salaryMax: undefined,
    equityMin: undefined,
    equityMax: undefined
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/matches?roleId=${data.roleId}`)
      } else {
        console.error("Failed to submit intake form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSkill = (skill: string) => {
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skill]
      })
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(skill => skill !== skillToRemove)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(currentSkill)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Define Your Hiring Needs</h1>
          <p className="text-gray-600 mt-2">
            Tell us about the role you're looking to fill and we'll find the perfect candidates for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Role Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Full-Stack Engineer, Product Designer, Marketing Manager"
              />
            </div>

            {/* Role Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required *
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(currentSkill)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skillOptions.slice(0, 15).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {formData.skillsRequired.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    {formData.skillsRequired.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Working Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Working Style *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["remote", "hybrid", "onsite"].map((style) => (
                  <label key={style} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="workingStyle"
                      value={style}
                      checked={formData.workingStyle === style}
                      onChange={(e) => setFormData({ ...formData, workingStyle: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.workingStyle === style ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}>
                      {formData.workingStyle === style && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <div>
                      <MapPin className="h-4 w-4 text-gray-400 inline mr-2" />
                      <span className="font-medium capitalize">{style}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time Zone *
              </label>
              <input
                type="text"
                required
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., PST, EST, UTC+2, or &apos;Flexible&apos;"
              />
            </div>

            {/* Culture Fit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Culture & Working Style Preferences *
              </label>
              <textarea
                required
                rows={3}
                value={formData.cultureFit}
                onChange={(e) => setFormData({ ...formData, cultureFit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your company culture, working style, and what type of person would thrive on your team..."
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hiring Urgency *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {urgencyOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <label key={option.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="urgency"
                        value={option.value}
                        checked={formData.urgency === option.value}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        formData.urgency === option.value ? "border-blue-600 bg-blue-600" : "border-gray-300"
                      }`}>
                        {formData.urgency === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      <div className={`${option.bgColor} w-8 h-8 rounded-lg flex items-center justify-center mr-3`}>
                        <IconComponent className={`h-4 w-4 ${option.color}`} />
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Compensation Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range (USD)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={formData.salaryMin || ""}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min"
                  />
                  <span className="flex items-center text-gray-500">to</span>
                  <input
                    type="number"
                    value={formData.salaryMax || ""}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equity Range (%)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.equityMin || ""}
                    onChange={(e) => setFormData({ ...formData, equityMin: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min %"
                  />
                  <span className="flex items-center text-gray-500">to</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.equityMax || ""}
                    onChange={(e) => setFormData({ ...formData, equityMax: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Max %"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || formData.skillsRequired.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? "Finding Candidates..." : "Find Candidates"}
              <Users className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}