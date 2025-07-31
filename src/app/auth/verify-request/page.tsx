import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
            
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            
            <p className="text-gray-600 mb-6">
              A sign in link has been sent to your email address.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Didn't receive the email?</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Check your spam folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• The link expires in 24 hours</li>
              </ul>
            </div>
            
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Try again
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Contact us at{" "}
            <a href="mailto:support@warmtrial.com" className="text-blue-600 hover:text-blue-700">
              support@warmtrial.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}