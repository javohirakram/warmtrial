"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { ArrowLeft, Clock, DollarSign, FileText, CheckCircle, Users, Star, Calendar } from "lucide-react"
import { sampleTrialTemplates } from "@/data/sample-data"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Match {
  id: string
  role: {
    title: string
    description: string
  }
  candidate: {
    name: string
    skills: string[]
  }
  founder: {
    name: string
  }
}

interface TrialTemplate {
  title: string
  description: string
  requirements: string
  deliverables: string
  timeline: string
  fee: number
}

export default function TrialPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const matchId = params.matchId as string
  
  const [match, setMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<TrialTemplate | null>(null)
  const [customTrial, setCustomTrial] = useState<TrialTemplate>({
    title: "",
    description: "",
    requirements: "",
    deliverables: "",
    timeline: "",
    fee: 50000 // $500 default
  })
  const [isCustom, setIsCustom] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    if (!matchId) return
    fetchMatch()
  }, [matchId])

  useEffect(() => {
    if (sampleTrialTemplates.length > 0) {
      setSelectedTemplate(sampleTrialTemplates[0])
    }
  }, [])

  const fetchMatch = async () => {
    try {
      // Mock match data - in production this would come from API
      setMatch({
        id: matchId,
        role: {
          title: "Senior Full-Stack Engineer",
          description: "We're looking for an experienced full-stack developer..."
        },
        candidate: {
          name: "Alex Chen",
          skills: ["React", "Node.js", "PostgreSQL", "TypeScript"]
        },
        founder: {
          name: "Current User"
        }
      })
    } catch (error) {
      console.error("Error fetching match:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (template: TrialTemplate) => {
    setSelectedTemplate(template)
    setIsCustom(false)
  }

  const handleCustomTrial = () => {
    setIsCustom(true)
    setSelectedTemplate(null)
  }

  const getCurrentTrial = (): TrialTemplate => {
    return isCustom ? customTrial : selectedTemplate!
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  const handlePayment = async () => {
    setIsProcessingPayment(true)
    
    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe not loaded")
      }

      const trial = getCurrentTrial()
      
      // Create checkout session
      const response = await fetch("/api/trial/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          trial
        }),
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId,
      })

      if (result.error) {
        console.error("Stripe error:", result.error)
      }
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Match not found</h2>
          <Link href="/matches" className="text-blue-600 hover:text-blue-700">
            Back to matches
          </Link>
        </div>
      </div>
    )
  }

  const trial = getCurrentTrial()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/matches" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to matches
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Trial Work Project</h1>
          <p className="text-gray-600 mt-2">
            Set up a paid trial project with <span className="font-semibold">{match.candidate.name}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trial Templates */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Trial Project</h2>
              
              <div className="space-y-3">
                {sampleTrialTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTemplate === template
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Clock className="h-3 w-3" />
                      {template.timeline}
                      <DollarSign className="h-3 w-3 ml-2" />
                      {formatPrice(template.fee)}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  </button>
                ))}

                <button
                  onClick={handleCustomTrial}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isCustom
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-1">Custom Project</h3>
                  <p className="text-sm text-gray-600">
                    Create your own trial project from scratch
                  </p>
                </button>
              </div>
            </div>

            {/* Candidate Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Users className="h-5 w-5 inline mr-2" />
                Candidate
              </h3>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">{match.candidate.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {match.candidate.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trial Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {isCustom ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Create Custom Trial</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={customTrial.title}
                      onChange={(e) => setCustomTrial({ ...customTrial, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Build a user authentication system"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      value={customTrial.description}
                      onChange={(e) => setCustomTrial({ ...customTrial, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief overview of what the candidate will be working on..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements *
                    </label>
                    <textarea
                      rows={4}
                      value={customTrial.requirements}
                      onChange={(e) => setCustomTrial({ ...customTrial, requirements: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Specific technical requirements, constraints, and expectations..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deliverables *
                    </label>
                    <textarea
                      rows={3}
                      value={customTrial.deliverables}
                      onChange={(e) => setCustomTrial({ ...customTrial, deliverables: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What should be delivered at the end of the trial..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline *
                      </label>
                      <input
                        type="text"
                        value={customTrial.timeline}
                        onChange={(e) => setCustomTrial({ ...customTrial, timeline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 3 days, 1 week"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment (USD) *
                      </label>
                      <input
                        type="number"
                        value={customTrial.fee / 100}
                        onChange={(e) => setCustomTrial({ ...customTrial, fee: parseInt(e.target.value) * 100 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="500"
                        min="50"
                        step="50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                selectedTemplate && (
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {selectedTemplate.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {selectedTemplate.timeline}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatPrice(selectedTemplate.fee)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-700">{selectedTemplate.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                      <p className="text-gray-700">{selectedTemplate.requirements}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Deliverables</h3>
                      <p className="text-gray-700">{selectedTemplate.deliverables}</p>
                    </div>
                  </div>
                )
              )}

              {/* Payment Section */}
              <div className="border-t border-gray-200 mt-8 pt-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    <CheckCircle className="h-5 w-5 inline mr-2" />
                    How it works
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Pay the trial fee upfront to unlock project details</li>
                    <li>• Candidate completes the work within the specified timeline</li>
                    <li>• Both parties provide feedback and ratings</li>
                    <li>• Decide whether to move forward with a full offer</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(trial.fee)}
                    </div>
                    <div className="text-sm text-gray-600">
                      One-time trial project fee
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment || (isCustom && !trial.title)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4" />
                        Pay & Start Trial
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}