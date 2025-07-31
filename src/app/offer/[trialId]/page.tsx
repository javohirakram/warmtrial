"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Send, User, Building, DollarSign, Calendar, FileText } from "lucide-react"

interface Trial {
  id: string
  title: string
  status: string
  candidate: {
    name: string
    email: string
  }
  founder: {
    name: string
  }
  match: {
    role: {
      title: string
    }
  }
}

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

const benefitOptions = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "401(k) with Company Match",
  "Flexible PTO",
  "Remote Work Options",
  "Home Office Stipend",
  "Learning & Development Budget",
  "Stock Options",
  "Commuter Benefits",
  "Gym Membership",
  "Meals & Snacks"
]

export default function OfferGeneratorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const trialId = params.trialId as string
  
  const [trial, setTrial] = useState<Trial | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const [offerData, setOfferData] = useState<OfferData>({
    title: "",
    type: "FULL_TIME",
    salary: undefined,
    hourlyRate: undefined,
    equity: undefined,
    vestingSchedule: "4 years with 1 year cliff",
    benefits: [],
    responsibilities: "",
    startDate: ""
  })

  useEffect(() => {
    if (!trialId) return
    fetchTrial()
  }, [trialId])

  const fetchTrial = async () => {
    try {
      // Mock trial data - in production this would come from API
      setTrial({
        id: trialId,
        title: "Frontend Component Implementation",
        status: "COMPLETED",
        candidate: {
          name: "Alex Chen",
          email: "alex.chen@example.com"
        },
        founder: {
          name: "Current User"
        },
        match: {
          role: {
            title: "Senior Full-Stack Engineer"
          }
        }
      })
      
      // Pre-populate some fields
      setOfferData(prev => ({
        ...prev,
        title: "Senior Full-Stack Engineer",
        responsibilities: "• Lead development of core product features\n• Collaborate with design and product teams\n• Mentor junior developers\n• Contribute to technical architecture decisions\n• Participate in code reviews and maintain high code quality standards"
      }))
    } catch (error) {
      console.error("Error fetching trial:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBenefitToggle = (benefit: string) => {
    setOfferData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }))
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/offer/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trialId,
          offerData
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `offer-letter-${trial?.candidate.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendOffer = async () => {
    setIsSending(true)
    try {
      const response = await fetch("/api/offer/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trialId,
          offerData
        }),
      })

      if (response.ok) {
        router.push(`/offer/sent?trialId=${trialId}`)
      }
    } catch (error) {
      console.error("Error sending offer:", error)
    } finally {
      setIsSending(false)
    }
  }

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trial not found</h2>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Generate Offer Letter</h1>
          <p className="text-gray-600 mt-2">
            Create a professional offer letter for <span className="font-semibold">{trial.candidate.name}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Candidate & Trial Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <User className="h-5 w-5 inline mr-2" />
                Candidate
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{trial.candidate.name}</p>
                <p className="text-sm text-gray-600">{trial.candidate.email}</p>
                <p className="text-sm text-gray-600">Trial: {trial.title}</p>
                <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {trial.status.toLowerCase().replace(/_/g, ' ')}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Offer Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Research market rates using our benchmarking tool</li>
                <li>• Consider the candidate's trial performance</li>
                <li>• Be competitive but within your budget</li>
                <li>• Include growth opportunities and company vision</li>
              </ul>
            </div>
          </div>

          {/* Offer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form className="space-y-6">
                {/* Role Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title *
                  </label>
                  <input
                    type="text"
                    value={offerData.title}
                    onChange={(e) => setOfferData({ ...offerData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Senior Full-Stack Engineer"
                  />
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Employment Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "FULL_TIME", label: "Full-Time Employee" },
                      { value: "CONTRACT", label: "Contract/Freelance" }
                    ].map((type) => (
                      <label key={type.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={offerData.type === type.value}
                          onChange={(e) => setOfferData({ ...offerData, type: e.target.value as any })}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          offerData.type === type.value ? "border-blue-600 bg-blue-600" : "border-gray-300"
                        }`}>
                          {offerData.type === type.value && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <span className="font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Compensation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Compensation *
                  </label>
                  {offerData.type === "FULL_TIME" ? (
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Annual Salary (USD)</label>
                      <input
                        type="number"
                        value={offerData.salary || ""}
                        onChange={(e) => setOfferData({ ...offerData, salary: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="120000"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Hourly Rate (USD)</label>
                      <input
                        type="number"
                        value={offerData.hourlyRate || ""}
                        onChange={(e) => setOfferData({ ...offerData, hourlyRate: e.target.value ? parseInt(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="75"
                      />
                    </div>
                  )}
                </div>

                {/* Equity */}
                {offerData.type === "FULL_TIME" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Equity Percentage
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={offerData.equity || ""}
                        onChange={(e) => setOfferData({ ...offerData, equity: e.target.value ? parseFloat(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vesting Schedule
                      </label>
                      <input
                        type="text"
                        value={offerData.vestingSchedule || ""}
                        onChange={(e) => setOfferData({ ...offerData, vestingSchedule: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="4 years with 1 year cliff"
                      />
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {offerData.type === "FULL_TIME" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Benefits & Perks
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {benefitOptions.map((benefit) => (
                        <label key={benefit} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={offerData.benefits.includes(benefit)}
                            onChange={() => handleBenefitToggle(benefit)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{benefit}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Responsibilities *
                  </label>
                  <textarea
                    rows={6}
                    value={offerData.responsibilities}
                    onChange={(e) => setOfferData({ ...offerData, responsibilities: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="• Lead development of core product features&#10;• Collaborate with design and product teams&#10;• Mentor junior developers"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Start Date
                  </label>
                  <input
                    type="date"
                    value={offerData.startDate}
                    onChange={(e) => setOfferData({ ...offerData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </form>

              {/* Actions */}
              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || !offerData.title || !offerData.responsibilities}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSendOffer}
                    disabled={isSending || !offerData.title || !offerData.responsibilities}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Offer
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mt-3 text-center">
                  The offer will be sent to {trial.candidate.email} and saved for your records
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}