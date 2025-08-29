'use client'

import React from 'react'

export default function ConsensusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fs-16314 to-fs-16307">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-fs-16081 mb-4">
            Building Consensus
          </h1>
          <p className="text-xl text-fs-16099 max-w-3xl mx-auto">
            Decisions arise not from division but from the strength of common ground. 
            Every voice contributes to the collective wisdom that guides our community forward.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Active Consensus Building */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-fs-16081 mb-6">Active Discussions</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-fs-15056 pl-4">
                <h3 className="text-lg font-semibold text-fs-16081 mb-2">Community Center Renovation</h3>
                <p className="text-fs-16099 mb-3">
                  Discussion on priorities for the community center renovation project.
                </p>
                <div className="flex items-center justify-between text-sm text-fs-16152">
                  <span>127 participants</span>
                  <span>85% consensus</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-fs-16314 rounded-full h-2">
                    <div className="bg-fs-15056 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-fs-14272 pl-4">
                <h3 className="text-lg font-semibold text-fs-16081 mb-2">Public Transportation Routes</h3>
                <p className="text-fs-16099 mb-3">
                  Planning new bus routes to better serve underserved neighborhoods.
                </p>
                <div className="flex items-center justify-between text-sm text-fs-16152">
                  <span>89 participants</span>
                  <span>72% consensus</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-fs-16314 rounded-full h-2">
                    <div className="bg-fs-14272 h-2 rounded-full" style={{width: '72%'}}></div>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-fs-15180 pl-4">
                <h3 className="text-lg font-semibold text-fs-16081 mb-2">Environmental Initiatives</h3>
                <p className="text-fs-16099 mb-3">
                  Community-wide sustainability and green energy programs.
                </p>
                <div className="flex items-center justify-between text-sm text-fs-16152">
                  <span>156 participants</span>
                  <span>91% consensus</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-fs-16314 rounded-full h-2">
                    <div className="bg-fs-15180 h-2 rounded-full" style={{width: '91%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consensus Principles */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-fs-16081 mb-6">Consensus Principles</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fs-15056 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fs-16081 mb-2">Every Voice Matters</h3>
                  <p className="text-fs-16099">
                    No contribution is too small. Each bead strengthens the belt, each testimony strengthens the whole.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fs-14272 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fs-16081 mb-2">Sacred Record</h3>
                  <p className="text-fs-16099">
                    Once spoken, a voice is preserved immutably, forming a covenant of accountability.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fs-15180 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fs-16081 mb-2">Collective Power</h3>
                  <p className="text-fs-16099">
                    Individual pulses become a drumbeat; individual testimonies become the force of change.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fs-15187 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fs-16081 mb-2">Peace Through Action</h3>
                  <p className="text-fs-16099">
                    The system delivers visible victories, proving that unity creates real outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-fs-15056 hover:bg-fs-15044 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg mr-4">
            Join Discussion
          </button>
          <button className="bg-fs-14272 hover:bg-fs-14257 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
            View All Topics
          </button>
        </div>
      </div>
    </div>
  )
}
