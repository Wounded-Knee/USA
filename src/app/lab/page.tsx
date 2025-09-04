'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AuthDialog from '../components/AuthDialog'
import AuthButton from '../components/AuthButton'
import SectionBoundary from '../components/SectionBoundary'
import QOTDEditorDemo from '../components/QOTDEditor/QOTDEditorDemo'
import { useAuth } from '../contexts/AuthContext'

interface ComponentDemo {
  id: string
  name: string
  description: string
  component: React.ReactNode
  category: string
  href: string
}

export default function LabPage() {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);



  // Demo components
  const demoComponents: ComponentDemo[] = [
    {
      id: 'qotd-editor',
      name: 'QOTD Editor',
      description: 'Advanced editor for managing the Quote of the Day system. Create, edit, and delete quotes and backgrounds with full CRUD functionality. Features JSON export and role-based access control for Developer users only.',
      category: 'content',
      href: '/lab/qotd-editor',
      component: <QOTDEditorDemo />
    },
    {
      id: 'government-browser',
      name: 'Government Browser',
      description: 'Comprehensive tool for browsing and editing the complete US government structure. Features role-based access control with read-only mode for regular users and full editing capabilities for authorized administrators.',
      category: 'government',
      href: '/lab/government-browser',
      component: (
        <div className="space-y-4">
                  <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)] rounded-lg p-4">
          <h4 className="font-medium text-[var(--color-primary)] mb-2">Government Browser Features</h4>
          <ul className="text-sm text-[var(--color-primary)] space-y-1">
            <li>• Browse jurisdictions, offices, elections, and more</li>
            <li>• Role-based access control (Admin/Moderator for editing)</li>
            <li>• Search, filter, and sort government data</li>
            <li>• Create, edit, and delete government entities</li>
            <li>• Hierarchical data management</li>
          </ul>
        </div>
        <div className="text-center">
          <Link 
            href="/lab/government-browser"
            className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
          >
            Open Government Browser
          </Link>
        </div>
        </div>
      )
    },
    {
      id: 'role-test',
      name: 'Role System Test',
      description: 'Test and verify the user role system functionality. View current user roles, test role checking functions, and manage roles if you have admin privileges.',
      category: 'authentication',
      href: '/lab/role-test',
      component: (
        <div className="space-y-4">
                  <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)] rounded-lg p-4">
          <h4 className="font-medium text-[var(--color-primary)] mb-2">Role System Features</h4>
          <ul className="text-sm text-[var(--color-primary)] space-y-1">
            <li>• View current user roles and permissions</li>
            <li>• Test role checking functions</li>
            <li>• Role management interface (admin only)</li>
            <li>• Role badge display system</li>
          </ul>
        </div>
        <div className="text-center">
          <Link 
            href="/lab/role-test"
            className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
          >
            Test Role System
          </Link>
        </div>
        </div>
      )
    },

    {
      id: 'section-boundary',
      name: 'Section Boundary',
      description: 'Aesthetic transition components that provide smooth visual separation between page sections. Features Federal-themed design patterns and customizable styling.',
      category: 'layout',
      href: '/lab/section-boundary',
      component: (
        <div className="space-y-4">
                     <div className="bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-secondary-light)] p-4">
             <h4 className="font-medium text-[var(--color-text)] mb-2">Section Above</h4>
             <p className="text-sm text-[var(--color-text-secondary)]">Light gradient background</p>
           </div>
           <SectionBoundary topColor="rgb(239 246 255)" bottomColor="var(--surface)" variant="Forest-5" />
           <div className="bg-[var(--color-surface)] p-4">
             <h4 className="font-medium text-[var(--color-text)] mb-2">Section Below</h4>
             <p className="text-sm text-[var(--color-text-secondary)]">Surface background</p>
           </div>
                     <div className="flex gap-2">
             <SectionBoundary topColor="var(--background)" bottomColor="var(--primary)" variant="Forest-3" />
             <SectionBoundary topColor="var(--background)" bottomColor="var(--secondary)" variant="Forest-4" />
             <SectionBoundary topColor="var(--background)" bottomColor="var(--accent)" variant="Forest-5" />
           </div>
        </div>
      )
    },
    {
      id: 'identity-chips',
      name: 'Identity Chips',
      description: 'Interactive identity chip components for displaying various types of identity data. Features specialized chips for economic, educational, political, racial, religious, and other identity categories with unique styling and data visualization.',
      category: 'components',
      href: '/lab/identity-chips',
      component: (
        <div className="space-y-4">
          <div className="bg-[var(--color-primary-light)] border border-[var(--color-primary)] rounded-lg p-4">
            <h4 className="font-medium text-[var(--color-primary)] mb-2">Identity Chips Features</h4>
            <ul className="text-sm text-[var(--color-primary)] space-y-1">
              <li>• Base chip with common identity properties</li>
              <li>• Specialized chips for different identity types</li>
              <li>• Color-coded styling for each category</li>
              <li>• Population estimates and metadata display</li>
              <li>• Interactive click functionality</li>
            </ul>
          </div>
          <div className="text-center">
            <Link 
              href="/lab/identity-chips"
              className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
            >
              Open Identity Chips
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'authentication',
      name: 'Authentication Components',
      description: 'Login/register dialog, authentication buttons, and user profile components with Google OAuth integration and Federal design styling.',
      category: 'authentication',
      href: '/lab/auth-demo',
      component: (
        <div className="space-y-6">
          {/* Current User Status */}
          <div className="bg-[var(--color-background)] rounded-lg p-4">
            <h4 className="font-medium text-[var(--color-text)] mb-3">Current Authentication Status</h4>
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="bg-[var(--color-primary-light)] rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-[var(--color-primary)] font-semibold text-lg">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-[var(--color-text)]">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-[var(--color-text-secondary)]">@{user.username}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{user.email}</div>
                </div>
              </div>
            ) : (
              <p className="text-[var(--color-text-secondary)] text-sm">No user is currently signed in</p>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-[var(--color-text)] mb-2">Authentication Buttons</h4>
              <div className="flex flex-wrap gap-3">
                <AuthButton variant="default" />
                <AuthButton variant="compact" />
                <AuthButton variant="minimal" />
              </div>
            </div>

                         {/* Manual Trigger Button */}
             <div>
               <h4 className="font-medium text-[var(--color-text)] mb-2">Manual Dialog Trigger</h4>
               <div className="flex gap-3">
                 <button
                   onClick={() => {
                     setShowAuthDialog(true);
                   }}
                   className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-[var(--color-text-on-primary)] px-6 py-2 rounded-lg hover:from-[var(--color-primary-hover)] hover:to-[var(--color-secondary-hover)] transition-colors text-sm font-medium"
                 >
                   Open Auth Dialog
                 </button>
               </div>
             </div>
      </div>
    </div>
  )
}
  ]

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-accent)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--color-text-on-primary)] mb-4">
              Whitepine Lab
            </h1>
            <p className="text-xl text-[var(--color-text-on-primary)] mb-8 max-w-3xl mx-auto">
              A laboratory for developing and testing UI components in isolation. 
              Explore our Federal-themed components and experiment with the California democracy design system.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/"
                className="bg-[var(--color-surface)] bg-opacity-20 hover:bg-opacity-30 text-[var(--color-text-on-primary)] px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Component Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {demoComponents.map((component) => (
                         <div key={component.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
               <div className="p-6">
                 <h3 className="text-[var(--color-text)] font-semibold text-lg mb-3">
                   {component.name}
                 </h3>
                 <p className="text-[var(--color-text-secondary)] text-sm mb-6 leading-relaxed">
                   {component.description}
                 </p>
                 <div className="border-t border-[var(--color-border)] pt-4">
                   {component.component}
                 </div>
               </div>
               <div className="bg-[var(--color-background)] px-6 py-3">
                 <div className="flex justify-between items-center">
                   <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                     {component.category}
                   </span>
                   <Link 
                     href={component.href}
                     className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-sm font-medium transition-colors duration-200"
                   >
                     View Component →
                   </Link>
                 </div>
               </div>
             </div>
          ))}
        </div>

                 {/* Coming Soon Section */}
         <div className="mt-16 text-center">
           <h2 className="text-[var(--color-text)] font-semibold text-2xl mb-6">
             More Components Coming Soon
           </h2>
           <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
             We're working on additional components for the lab. Each component will have its own dedicated page 
             for comprehensive testing and documentation.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
             <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
               <div className="w-12 h-12 bg-[var(--color-background)] rounded-lg mb-4 mx-auto flex items-center justify-center">
                 <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <h3 className="text-[var(--color-text)] font-medium text-lg mb-2">Form Components</h3>
               <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                 Input fields, selectors, checkboxes, and other form elements with Federal styling.
               </p>
             </div>
             <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
               <div className="w-12 h-12 bg-[var(--color-background)] rounded-lg mb-4 mx-auto flex items-center justify-center">
                 <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                 </svg>
               </div>
               <h3 className="text-[var(--color-text)] font-medium text-lg mb-2">Notification Components</h3>
               <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                 Alerts, toasts, and notification systems for user feedback.
               </p>
             </div>
             <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
               <div className="w-12 h-12 bg-[var(--color-background)] rounded-lg mb-4 mx-auto flex items-center justify-center">
                 <svg className="w-6 h-6 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                 </svg>
               </div>
               <h3 className="text-[var(--color-text)] font-medium text-lg mb-2">Data Display</h3>
               <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                 Tables, lists, and data visualization components for content display.
               </p>
             </div>
           </div>
         </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
        initialMode="login" 
      />
    </div>
  )
}
