'use client'

import React from 'react'

export default function TestimoniesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fs-16314 to-fs-16307">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-fs-16081 mb-4">
            Sacred Testimonies
          </h1>
          <p className="text-xl text-fs-16099 max-w-3xl mx-auto">
            Each voice is a bead of silicon wampum, each testimony a covenant woven into the living record. 
            Together, these voices grow into a sheltering tree of democracy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimony Cards */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-fs-15056">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-fs-14272 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-fs-16081">Community Safety</h3>
            </div>
            <p className="text-fs-16099 mb-4">
              "Our neighborhood needs better lighting and community watch programs. 
              We've seen an increase in safety concerns that require immediate attention."
            </p>
            <div className="flex justify-between items-center text-sm text-fs-16152">
              <span>Sarah M., District 3</span>
              <span>2 days ago</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-fs-14272">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-fs-15180 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-fs-16081">Environmental Protection</h3>
            </div>
            <p className="text-fs-16099 mb-4">
              "The local park needs protection from development. 
              It's our children's only green space and must be preserved for future generations."
            </p>
            <div className="flex justify-between items-center text-sm text-fs-16152">
              <span>Michael R., District 7</span>
              <span>1 week ago</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-fs-15180">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-fs-15187 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-fs-16081">Education Access</h3>
            </div>
            <p className="text-fs-16099 mb-4">
              "We need better access to educational resources in underserved areas. 
              Every child deserves equal opportunities to learn and grow."
            </p>
            <div className="flex justify-between items-center text-sm text-fs-16152">
              <span>Dr. Elena T., District 5</span>
              <span>3 days ago</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-fs-15056 hover:bg-fs-15044 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
            Share Your Testimony
          </button>
        </div>
      </div>
    </div>
  )
}
