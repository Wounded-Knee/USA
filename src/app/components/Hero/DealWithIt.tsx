'use client'

import React from 'react'
import Image from 'next/image'

export default function DealWithIt() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-accent/10 rounded-full animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-8">
          <span className="block text-foreground">Deal</span>
          <span className="block bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">With It</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-neutral mb-8 max-w-2xl mx-auto">
          Democracy isn't just a word—it's action. 
          <br />
          <span className="font-semibold text-primary">Let's make it happen.</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Start Petition
          </button>
          <button className="px-8 py-4 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary-dark transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Join Discussion
          </button>
        </div>
      </div>

      {/* Floating action indicators */}
      <div className="absolute bottom-8 left-8 text-neutral text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span>Active now</span>
        </div>
      </div>
      
      <div className="absolute bottom-8 right-8 text-neutral text-sm">
        <div className="flex items-center space-x-2">
          <span>Scroll to explore</span>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
