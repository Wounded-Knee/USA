'use client'

import React from 'react'
import Image from 'next/image'

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-dots-pattern"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-blue-600 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-indigo-600 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-blue-700 rounded-full opacity-35 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-indigo-700 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <Image
              src="/california-bear-logo.png"
              alt="California Bear with Deal with it Glasses and Boater Hat"
              width={200}
              height={200}
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 transform hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="block">Democracy:</span>
          <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Deal with it.
          </span>
        </h1>        
      </div>
      
      {/* Background Pattern Styles */}
      <style jsx>{`
        .bg-dots-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='rgba(255, 255, 255, 1)'%3E%3Cpath d='M12 0l3.09 6.31L22 7.18l-5 4.87 1.18 6.88L12 15.75l-6.18 3.18L7 12.05 2 7.18l6.91-.87z'/%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
      `}</style>
    </div>
  )
}

export default Hero
