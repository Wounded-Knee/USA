'use client'

import React from 'react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fs-16314 to-fs-16307">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/whitepine-logo.svg"
              alt="Whitepine Logo"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-fs-16081 mb-6">
            About Whitepine
          </h1>
          <p className="text-xl text-fs-16099 max-w-4xl mx-auto leading-relaxed">
            A civic platform rooted in the Great Tree of Peace, carrying forward the tradition of consensus, 
            unity, and strength into the digital age.
          </p>
        </div>

        {/* Brand Story */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-fs-16081 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-fs-16099">
            <p className="mb-6">
              Long before the founding of the United States, the Haudenosaunee Peacemaker planted a great white pine 
              as the Tree of Peace. Beneath its roots, weapons of war were buried, never to rise again. Its branches 
              stretched outward, offering shelter to all nations who sought harmony. Its roots spread in every direction, 
              inviting others to join in peace.
            </p>
            <p className="mb-6">
              Whitepine continues this legacy in the digital age. Each citizen's voice is a bead of silicon wampum, 
              each testimony a covenant woven into the living record. Together, these voices grow into a sheltering 
              tree of democracy, too strong to be uprooted, too vast to be ignored.
            </p>
            <p>
              We believe that technology can amplify the wisdom of collective decision-making, creating a platform 
              where every voice matters and every contribution strengthens the whole community.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-fs-15056 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-fs-16081 mb-3">Unity through Diversity</h3>
            <p className="text-fs-16099">
              Like the branches of the tree, every voice is distinct, yet all contribute to the same canopy.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-fs-14272 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-fs-16081 mb-3">Consensus over Conflict</h3>
            <p className="text-fs-16099">
              Decisions arise not from division but from the strength of common ground.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-fs-15180 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-fs-16081 mb-3">Transparency as Covenant</h3>
            <p className="text-fs-16099">
              Testimonies are sacred records, woven together like wampum belts, preserving truth for all to see.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-fs-15187 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-fs-16081 mb-3">Strength from Roots</h3>
            <p className="text-fs-16099">
              The platform is grounded in the will of the people, spreading outward like the white pine's roots.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-fs-15042 to-fs-15044 rounded-lg shadow-md p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed">
            To create a digital platform where every citizen's voice contributes to collective wisdom, 
            where transparency builds trust, and where consensus emerges from the strength of diverse perspectives. 
            We are building the Great Tree of Peace for the digital age.
          </p>
        </div>
      </div>
    </div>
  )
}
