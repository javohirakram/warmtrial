export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 WarmTrial is LIVE!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The complete hiring platform for early-stage startups.
        </p>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ✅ Deployment Successful!
          </h2>
          <p className="text-gray-600">
            Your WarmTrial application is now running on Vercel.
          </p>
        </div>
      </div>
    </div>
  )
}