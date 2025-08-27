'use client'

import React from 'react'
import Image from 'next/image'

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#16213e] flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-dots-pattern"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-white rounded-full opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-32 w-3 h-3 bg-white rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-white rounded-full opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <Image
              src="/california-bear-logo.png"
              alt="California Bear with Deal with it Glasses and Straw Hat"
              width={200}
              height={200}
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 transform hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="block">Democracy:</span>
          <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Deal with it.
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          The California way of governance meets the ultimate power move. 
          Because democracy isn't just a system—it's an attitude.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Get Involved
          </button>
          <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-white hover:text-blue-900 transition-all duration-300">
            Learn More
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Background Pattern Styles */}
      <style jsx>{`
        .bg-dots-pattern {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 60px 60px;
        }
      `}</style>
    </div>
  )
}

export default Hero
