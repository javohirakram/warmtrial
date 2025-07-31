"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Webcam from "react-webcam"
import { ArrowLeft, Video, VideoOff, Play, Pause, RotateCcw, Upload, Check, Clock } from "lucide-react"

interface Match {
  id: string
  role: {
    title: string
    description: string
  }
  candidate: {
    name: string
  }
}

interface VibeCheckQuestions {
  [key: string]: string
}

const defaultQuestions = [
  {
    id: "motivation",
    question: "What excites you most about this role and our company?",
    placeholder: "Share what draws you to this opportunity..."
  },
  {
    id: "experience",
    question: "Describe a challenging project you've worked on recently. What was your approach?",
    placeholder: "Tell us about a specific project and your problem-solving process..."
  },
  {
    id: "culture",
    question: "How do you prefer to work and collaborate with teams?",
    placeholder: "Describe your ideal working environment and collaboration style..."
  },
  {
    id: "goals",
    question: "Where do you see yourself professionally in the next 2-3 years?",
    placeholder: "Share your career aspirations and goals..."
  },
  {
    id: "availability",
    question: "What's your availability and preferred start timeline?",
    placeholder: "Let us know when you could potentially start..."
  }
]

export default function VibeCheckPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const matchId = params.matchId as string
  
  const [match, setMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"video" | "questions">("video")
  
  // Video recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [webcamEnabled, setWebcamEnabled] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  
  // Questions state
  const [responses, setResponses] = useState<VibeCheckQuestions>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!matchId) return
    fetchMatch()
  }, [matchId])

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setRecordedVideo(url)
      setRecordedChunks([])
    }
  }, [recordedChunks])

  const fetchMatch = async () => {
    try {
      // This would typically fetch match details from an API
      // For now, we'll use mock data
      setMatch({
        id: matchId,
        role: {
          title: "Senior Full-Stack Engineer",
          description: "We're looking for an experienced full-stack developer to join our early-stage startup..."
        },
        candidate: {
          name: "Current User" // This would come from session
        }
      })
    } catch (error) {
      console.error("Error fetching match:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartRecording = () => {
    if (!webcamRef.current?.stream) return

    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    })

    mediaRecorderRef.current = mediaRecorder
    setRecordedChunks([])

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    })

    mediaRecorder.start()
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer
    const timer = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 60) { // Auto-stop at 60 seconds
          handleStopRecording()
          return 60
        }
        return prev + 1
      })
    }, 1000)
    setRecordingTimer(timer)
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
    if (recordingTimer) {
      clearInterval(recordingTimer)
      setRecordingTimer(null)
    }
  }

  const handleRetakeVideo = () => {
    setRecordedVideo(null)
    setRecordingTime(0)
  }

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // In a real implementation, you'd upload the video file first
      const videoUrl = recordedVideo // This would be the uploaded video URL
      
      const response = await fetch(`/api/vibe-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          videoUrl,
          responses
        }),
      })

      if (response.ok) {
        router.push(`/vibe-check/success?matchId=${matchId}`)
      } else {
        console.error("Failed to submit vibe check")
      }
    } catch (error) {
      console.error("Error submitting vibe check:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  const canSubmit = (recordedVideo || activeTab === "questions") && 
                   Object.keys(responses).length >= defaultQuestions.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/matches" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to matches
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Vibe Check</h1>
          <p className="text-gray-600 mt-2">
            Complete your vibe check for <span className="font-semibold">{match.role.title}</span>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("video")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "video"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Video className="h-4 w-4 inline mr-2" />
                Video Introduction
              </button>
              <button
                onClick={() => setActiveTab("questions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "questions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Check className="h-4 w-4 inline mr-2" />
                Q&A Form
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "video" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Record a 60-second introduction
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tell us about yourself, your interest in this role, and what makes you a great fit. 
                    Keep it casual and authentic - we want to get to know the real you!
                  </p>
                </div>

                <div className="bg-gray-100 rounded-lg p-6">
                  {!webcamEnabled && !recordedVideo && (
                    <div className="text-center">
                      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">Enable your camera</h4>
                      <p className="text-gray-600 mb-4">
                        We'll need access to your camera to record your introduction.
                      </p>
                      <button
                        onClick={() => setWebcamEnabled(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Enable Camera
                      </button>
                    </div>
                  )}

                  {webcamEnabled && !recordedVideo && (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <Webcam
                          ref={webcamRef}
                          audio={true}
                          className="w-full h-64 object-cover"
                          mirrored={true}
                        />
                        {isRecording && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            REC {formatTime(recordingTime)}
                          </div>
                        )}
                        {recordingTime > 0 && recordingTime < 60 && !isRecording && (
                          <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                            {formatTime(recordingTime)}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-center gap-4">
                        {!isRecording ? (
                          <button
                            onClick={handleStartRecording}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2"
                          >
                            <Video className="h-4 w-4" />
                            Start Recording
                          </button>
                        ) : (
                          <button
                            onClick={handleStopRecording}
                            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                          >
                            <VideoOff className="h-4 w-4" />
                            Stop Recording
                          </button>
                        )}
                      </div>

                      {recordingTime >= 60 && (
                        <div className="text-center text-sm text-amber-600">
                          Maximum recording time reached (60 seconds)
                        </div>
                      )}
                    </div>
                  )}

                  {recordedVideo && (
                    <div className="space-y-4">
                      <div className="bg-black rounded-lg overflow-hidden">
                        <video
                          src={recordedVideo}
                          controls
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleRetakeVideo}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retake
                        </button>
                        <button
                          onClick={() => setActiveTab("questions")}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Continue to Questions
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "questions" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Answer a few questions
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Help us understand your background, motivations, and how you'd be a great fit for this role.
                  </p>
                </div>

                <div className="space-y-6">
                  {defaultQuestions.map((q, index) => (
                    <div key={q.id} className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {index + 1}. {q.question}
                      </label>
                      <textarea
                        rows={4}
                        value={responses[q.id] || ""}
                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={q.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {recordedVideo && <span className="text-green-600">✓ Video recorded</span>}
            {Object.keys(responses).length >= defaultQuestions.length && (
              <span className="text-green-600 ml-4">✓ Questions completed</span>
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Vibe Check"}
            <Check className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}