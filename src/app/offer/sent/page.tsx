"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Mail, Calendar, FileText, TrendingUp } from "lucide-react"

export default function OfferSent() {
  const searchParams = useSearchParams()
  const trialId = searchParams.get("trialId")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Offer Letter Sent! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your offer letter has been successfully sent to the candidate. 
            They will receive an email with the offer details and next steps.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">What happens now?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Email Notification</h3>
                  <p className="text-sm text-blue-800">
                    The candidate has been notified via email with the offer details and a link to accept or decline.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Response Timeline</h3>
                  <p className="text-sm text-blue-800">
                    Most candidates respond within 3-7 business days. You'll be notified 
                    immediately when they accept or decline.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Documentation</h3>
                  <p className="text-sm text-blue-800">
                    The offer letter is saved in your dashboard for reference and 
                    can be downloaded at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-900 mb-2">💡 While You Wait</h3>
            <ul className="text-sm text-yellow-800 space-y-1 text-left">
              <li>• Prepare onboarding materials and workspace setup</li>
              <li>• Plan the first week's tasks and introductions</li>
              <li>• Consider posting additional roles to build your team</li>
              <li>• Update your hiring pipeline with lessons learned</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                View Dashboard
              </Link>
              <Link
                href="/intake"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Post Another Role
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">🚀 You've completed the full hiring flow!</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Role Posted</p>
            </div>
            <div>
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Matches Found</p>
            </div>
            <div>
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Trial Completed</p>
            </div>
            <div>
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Offer Sent</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help with onboarding or have questions?{" "}
            <a href="mailto:support@warmtrial.com" className="text-blue-600 hover:text-blue-700">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}