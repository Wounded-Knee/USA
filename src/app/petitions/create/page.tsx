'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CreatePetitionForm from '../../components/CreatePetitionForm'

const CreatePetitionPage: React.FC = () => {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdPetition, setCreatedPetition] = useState<any>(null)

  const handleSuccess = (petition: any) => {
    setCreatedPetition(petition)
    setShowSuccess(true)
  }

  const handleCancel = () => {
    router.push('/petitions')
  }

  const handleViewPetition = () => {
    if (createdPetition) {
      router.push(`/petitions/${createdPetition._id}`)
    }
  }

  const handleCreateAnother = () => {
    setShowSuccess(false)
    setCreatedPetition(null)
  }

  if (showSuccess && createdPetition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-surface rounded-lg shadow-lg p-8 border border-neutral-light text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Petition Created Successfully!</h1>
                <p className="text-neutral">Your petition "{createdPetition.title}" has been created and is now live.</p>
              </div>

              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Share your petition with others to gather support</li>
                  <li>• Monitor progress and engagement</li>
                  <li>• Consider contributing vigor to increase impact</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleViewPetition}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
                >
                  View Petition
                </button>
                <button
                  onClick={handleCreateAnother}
                  className="flex-1 bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-secondary-dark transition-colors duration-200"
                >
                  Create Another
                </button>
                <Link
                  href="/petitions"
                  className="flex-1 bg-neutral text-white py-3 px-6 rounded-lg font-semibold hover:bg-neutral-dark transition-colors duration-200 text-center"
                >
                  Back to Petitions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <nav className="mb-4">
              <Link 
                href="/petitions" 
                className="text-primary hover:text-primary-dark transition-colors duration-200"
              >
                ← Back to Petitions
              </Link>
            </nav>
            <h1 className="text-4xl font-bold text-foreground mb-4">Create a New Petition</h1>
            <p className="text-lg text-neutral">
              Start a petition to advocate for change in your community. Connect it to the appropriate government entity to make it more actionable.
            </p>
          </div>

          {/* Form */}
          <CreatePetitionForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips for Creating Effective Petitions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2">Choose the Right Jurisdiction</h4>
                <ul className="space-y-1">
                  <li>• Federal for national issues</li>
                  <li>• State for state-level policies</li>
                  <li>• Local for community concerns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Target Specific Entities</h4>
                <ul className="space-y-1">
                  <li>• Select governing bodies that can act</li>
                  <li>• Link to relevant legislation when possible</li>
                  <li>• Be specific about what you want changed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePetitionPage
