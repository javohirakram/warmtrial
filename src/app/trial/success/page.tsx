"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, ArrowRight, Clock, Users, MessageSquare, FileText } from "lucide-react"

export default function TrialSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const trialId = searchParams.get("trial_id")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Trial Project Started! 🚀
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Payment successful! Your trial project is now active and both you and the candidate 
            have been notified with the project details.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Candidate Gets Started</h3>
                  <p className="text-sm text-blue-800">
                    The candidate will receive project details and can begin working immediately.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Work & Progress Updates</h3>
                  <p className="text-sm text-blue-800">
                    Stay in touch during the trial period. The candidate will provide updates 
                    and ask questions as needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Mutual Feedback</h3>
                  <p className="text-sm text-blue-800">
                    After project completion, both parties will provide feedback and ratings 
                    to help with the final hiring decision.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Make an Offer</h3>
                  <p className="text-sm text-blue-800">
                    If everything goes well, you can generate and send a formal offer letter 
                    directly through the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-yellow-800 space-y-1 text-left">
              <li>• Be available for questions during the trial period</li>
              <li>• Provide clear feedback on deliverables</li>
              <li>• Consider the candidate's communication style and work approach</li>
              <li>• Remember, this is as much about culture fit as technical skills</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                View Dashboard
              </Link>
              <Link
                href="/matches"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                View More Candidates
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Questions about your trial project?{" "}
            <a href="mailto:support@warmtrial.com" className="text-blue-600 hover:text-blue-700">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}