"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, Clock, Video } from "lucide-react"

export default function VibeCheckSuccess() {
  const searchParams = useSearchParams()
  const matchId = searchParams.get("matchId")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vibe Check Submitted! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for completing your vibe check. The founding team will review your 
            submission and get back to you soon with next steps.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <Video className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Review Process</h3>
                  <p className="text-sm text-blue-800">
                    The founders will review your video introduction and Q&A responses within 24-48 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Trial Work Opportunity</h3>
                  <p className="text-sm text-blue-800">
                    If there's mutual interest, you'll be invited to participate in a paid trial project 
                    to showcase your skills.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Final Decision</h3>
                  <p className="text-sm text-blue-800">
                    After the trial project, both parties will provide feedback and decide on moving forward.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Keep the momentum going</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/matches"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View More Opportunities
              </Link>
              <Link
                href="/"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions? Reach out to us at{" "}
            <a href="mailto:support@warmtrial.com" className="text-blue-600 hover:text-blue-700">
              support@warmtrial.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}