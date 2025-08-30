'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface VigorActivityProps {
  voteId: string
  petitionTitle: string
  onVigorContributed: (vigorData: any) => void
  onClose: () => void
}

interface ActivityData {
  shakeIntensity?: number
  shakeDuration?: number
  shakeCount?: number
  voiceConfidence?: number
  voiceDuration?: number
  voiceClarity?: number
  audioRecording?: string
  statementText?: string
  statementLength?: number
  statementEmotion?: string
  completionTime?: number
  focusScore?: number
  emotionalIntensity?: number
}

const VigorActivity: React.FC<VigorActivityProps> = ({ 
  voteId, 
  petitionTitle, 
  onVigorContributed, 
  onClose 
}) => {
  const [vigorType, setVigorType] = useState<'shake' | 'voice' | 'statement'>('shake')
  const [isActive, setIsActive] = useState(false)
  const [activityData, setActivityData] = useState<ActivityData>({})
  const [signingStatement, setSigningStatement] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs for activity tracking
  const shakeStartTime = useRef<number>(0)
  const shakeCount = useRef<number>(0)
  const shakeIntensity = useRef<number>(0)
  const voiceStartTime = useRef<number>(0)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])

  // Shake detection
  useEffect(() => {
    if (vigorType === 'shake' && isActive) {
      const handleDeviceMotion = (event: DeviceMotionEvent) => {
        if (event.acceleration) {
          const { x, y, z } = event.acceleration
          const intensity = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2)
          shakeIntensity.current = Math.max(shakeIntensity.current, intensity)
          
          if (intensity > 15) { // Threshold for shake detection
            shakeCount.current++
          }
        }
      }

      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleDeviceMotion)
        return () => window.removeEventListener('devicemotion', handleDeviceMotion)
      }
    }
  }, [vigorType, isActive])

  // Voice recording
  useEffect(() => {
    if (vigorType === 'voice' && isActive) {
      startVoiceRecording()
    } else if (vigorType === 'voice' && !isActive && mediaRecorder.current) {
      stopVoiceRecording()
    }
  }, [vigorType, isActive])

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      audioChunks.current = []

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setActivityData(prev => ({
          ...prev,
          audioRecording: audioUrl,
          voiceDuration: (Date.now() - voiceStartTime.current) / 1000
        }))
      }

      voiceStartTime.current = Date.now()
      mediaRecorder.current.start()
    } catch (error) {
      console.error('Error starting voice recording:', error)
      setError('Could not access microphone')
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop()
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const startActivity = () => {
    setIsActive(true)
    setError(null)
    
    if (vigorType === 'shake') {
      shakeStartTime.current = Date.now()
      shakeCount.current = 0
      shakeIntensity.current = 0
    } else if (vigorType === 'voice') {
      voiceStartTime.current = Date.now()
    }
  }

  const stopActivity = () => {
    setIsActive(false)
    
    if (vigorType === 'shake') {
      const duration = (Date.now() - shakeStartTime.current) / 1000
      setActivityData({
        shakeIntensity: shakeIntensity.current,
        shakeDuration: duration,
        shakeCount: shakeCount.current,
        completionTime: duration,
        focusScore: Math.min(100, (shakeCount.current / 10) * 100),
        emotionalIntensity: Math.min(100, (shakeIntensity.current / 50) * 100)
      })
    } else if (vigorType === 'voice') {
      const duration = (Date.now() - voiceStartTime.current) / 1000
      setActivityData(prev => ({
        ...prev,
        voiceDuration: duration,
        voiceConfidence: Math.min(100, (duration / 30) * 100),
        voiceClarity: 85, // Placeholder - would be calculated from audio analysis
        completionTime: duration,
        focusScore: Math.min(100, (duration / 60) * 100),
        emotionalIntensity: 75 // Placeholder - would be calculated from voice analysis
      }))
    }
  }

  const handleStatementChange = (text: string) => {
    setActivityData(prev => ({
      ...prev,
      statementText: text,
      statementLength: text.length,
      statementEmotion: getEmotionFromText(text)
    }))
  }

  const getEmotionFromText = (text: string): string => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('angry') || lowerText.includes('furious') || lowerText.includes('outraged')) {
      return 'angry'
    } else if (lowerText.includes('passionate') || lowerText.includes('strongly') || lowerText.includes('must')) {
      return 'passionate'
    } else if (lowerText.includes('determined') || lowerText.includes('will') || lowerText.includes('need')) {
      return 'determined'
    } else if (lowerText.includes('concerned') || lowerText.includes('worried') || lowerText.includes('fear')) {
      return 'concerned'
    } else if (lowerText.includes('hope') || lowerText.includes('believe') || lowerText.includes('future')) {
      return 'hopeful'
    }
    return 'neutral'
  }

  const submitVigor = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('http://localhost:5000/api/vigor/contribute', {
        userId: 'current-user-id', // This would come from auth context
        voteId,
        vigorType,
        activityData,
        signingStatement
      })

      onVigorContributed(response.data)
      onClose()
    } catch (error) {
      console.error('Error submitting vigor:', error)
      setError('Failed to submit vigor contribution')
    } finally {
      setLoading(false)
    }
  }

  const getActivityInstructions = () => {
    switch (vigorType) {
      case 'shake':
        return 'Hold your device firmly and shake it with conviction for your cause. The more intense and longer you shake, the more vigor you contribute.'
      case 'voice':
        return 'Speak your signing statement with confidence and conviction. Your voice will be recorded as a testament to your commitment.'
      case 'statement':
        return 'Write a personal statement about why this cause matters to you. Express your emotions and convictions clearly.'
      default:
        return ''
    }
  }

  const getActivityButton = () => {
    if (vigorType === 'statement') return null

    return (
      <button
        onClick={isActive ? stopActivity : startActivity}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
          isActive
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isActive ? 'Stop Activity' : `Start ${vigorType.charAt(0).toUpperCase() + vigorType.slice(1)} Activity`}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contribute Vigor</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Petition</h3>
            <p className="text-gray-600">{petitionTitle}</p>
          </div>

          {/* Activity Type Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Your Vigor Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['shake', 'voice', 'statement'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setVigorType(type)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    vigorType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Instructions */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{getActivityInstructions()}</p>
          </div>

          {/* Activity Interface */}
          <div className="mb-6">
            {getActivityButton()}

            {vigorType === 'statement' && (
              <div className="space-y-4">
                <textarea
                  value={activityData.statementText || ''}
                  onChange={(e) => handleStatementChange(e.target.value)}
                  placeholder="Write your personal statement about why this cause matters to you..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-sm text-gray-500">
                  {activityData.statementLength || 0} characters
                </div>
              </div>
            )}

            {/* Activity Progress */}
            {isActive && vigorType === 'shake' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-700 mb-2">
                    Shake Count: {shakeCount.current}
                  </div>
                  <div className="text-sm text-yellow-600">
                    Intensity: {Math.round(shakeIntensity.current)}
                  </div>
                </div>
              </div>
            )}

            {isActive && vigorType === 'voice' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    Recording...
                  </div>
                  <div className="text-sm text-green-600">
                    Speak with conviction!
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Signing Statement */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signing Statement (Optional)
            </label>
            <textarea
              value={signingStatement}
              onChange={(e) => setSigningStatement(e.target.value)}
              placeholder="Add a personal statement that will be attached to your vote..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={submitVigor}
            disabled={loading || (!isActive && vigorType !== 'statement')}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              loading || (!isActive && vigorType !== 'statement')
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Submitting...' : 'Contribute Vigor'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VigorActivity
