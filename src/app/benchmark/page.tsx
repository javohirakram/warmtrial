"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, DollarSign, PieChart, MapPin, Building, Users } from "lucide-react"
import { sampleBenchmarkData } from "@/data/sample-data"
import { BenchmarkData } from "@/types"

const roleOptions = [
  "Software Engineer",
  "Product Manager", 
  "Product Designer",
  "DevOps Engineer",
  "Data Scientist",
  "Marketing Manager",
  "Sales Manager"
]

const levelOptions = ["Junior", "Mid", "Senior", "Staff", "Principal"]
const locationOptions = ["San Francisco", "New York", "Austin", "Seattle", "Remote", "Boston", "Chicago"]
const stageOptions = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C+"]

export default function BenchmarkPage() {
  const [selectedRole, setSelectedRole] = useState("Software Engineer")
  const [selectedLevel, setSelectedLevel] = useState("Mid")
  const [selectedLocation, setSelectedLocation] = useState("San Francisco")
  const [selectedStage, setSelectedStage] = useState("Seed")
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([])
  const [filteredData, setFilteredData] = useState<BenchmarkData | null>(null)

  useEffect(() => {
    // Load benchmark data (in production, this would come from an API)
    setBenchmarkData(sampleBenchmarkData)
  }, [])

  useEffect(() => {
    // Filter data based on selections
    const match = benchmarkData.find(
      data => 
        data.role === selectedRole &&
        data.level === selectedLevel &&
        data.location === selectedLocation &&
        data.companyStage === selectedStage
    )
    setFilteredData(match || null)
  }, [selectedRole, selectedLevel, selectedLocation, selectedStage, benchmarkData])

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 100) // Convert from cents
  }

  const formatEquity = (percentage: number) => {
    return `${percentage.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Salary & Equity Benchmarks</h1>
          <p className="text-gray-600 mt-2">
            Get real-time compensation data to make competitive offers and attract top talent.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Benchmarks</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {levelOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {locationOptions.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-1" />
                    Company Stage
                  </label>
                  <select
                    value={selectedStage}
                    onChange={(e) => setSelectedStage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {stageOptions.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-blue-800">
                  Remote positions typically offer 10-20% lower base salary but often include higher equity or additional benefits.
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {filteredData ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedLevel} {selectedRole}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {selectedLocation} • {selectedStage}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Salary Range */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Annual Salary</h3>
                      </div>
                      <div className="text-2xl font-bold text-green-900 mb-1">
                        {formatSalary(filteredData.salaryMin)} - {formatSalary(filteredData.salaryMax)}
                      </div>
                      <div className="text-sm text-green-700">
                        Median: {formatSalary((filteredData.salaryMin + filteredData.salaryMax) / 2)}
                      </div>
                    </div>

                    {/* Equity Range */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <PieChart className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">Equity Range</h3>
                      </div>
                      <div className="text-2xl font-bold text-purple-900 mb-1">
                        {formatEquity(filteredData.equityMin)} - {formatEquity(filteredData.equityMax)}
                      </div>
                      <div className="text-sm text-purple-700">
                        Typical: {formatEquity((filteredData.equityMin + filteredData.equityMax) / 2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Insights */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 rounded-full p-1">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Competitive Range</h4>
                        <p className="text-sm text-gray-600">
                          This role typically commands {formatSalary(filteredData.salaryMin)} to {formatSalary(filteredData.salaryMax)} 
                          in {selectedLocation} for {selectedStage} stage companies.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <PieChart className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Equity Considerations</h4>
                        <p className="text-sm text-gray-600">
                          {selectedStage} companies typically offer {formatEquity(filteredData.equityMin)}-{formatEquity(filteredData.equityMax)} equity 
                          for {selectedLevel} level roles, with vesting over 4 years.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-yellow-100 rounded-full p-1">
                        <MapPin className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Location Impact</h4>
                        <p className="text-sm text-gray-600">
                          {selectedLocation === "Remote" 
                            ? "Remote positions often offer 10-20% lower base salary but may include additional benefits."
                            : `${selectedLocation} is a competitive market with salaries typically 10-30% above national average.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Roles */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Roles</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {benchmarkData
                      .filter(data => 
                        data.role !== selectedRole && 
                        data.level === selectedLevel && 
                        data.location === selectedLocation &&
                        data.companyStage === selectedStage
                      )
                      .slice(0, 4)
                      .map((data, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                             onClick={() => setSelectedRole(data.role)}>
                          <h4 className="font-medium text-gray-900">{data.role}</h4>
                          <div className="text-sm text-gray-600">
                            {formatSalary(data.salaryMin)} - {formatSalary(data.salaryMax)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatEquity(data.equityMin)} - {formatEquity(data.equityMax)} equity
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-600 mb-4">
                  We don&apos;t have benchmark data for this specific combination yet. 
                  Try adjusting your filters or check back soon as we&apos;re constantly updating our database.
                </p>
                <div className="text-sm text-gray-500">
                  Showing data for {benchmarkData.length} role combinations
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to make competitive offers?</h2>
          <p className="text-blue-100 mb-6">
            Use these benchmarks to structure compelling compensation packages that attract top talent.
          </p>
          <Link
            href="/intake"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Hiring Now
          </Link>
        </div>
      </div>
    </div>
  )
}