'use client'

import SandGraph from '../components/SandGraph'

export default function SandGraphPage() {
  return (
    <div className="min-h-screen bg-background">
      <SandGraph 
        title="Sand Graph Demo"
        subtitle="Democracy Sand Graph"
        width="100%"
        height="100vh"
      />
    </div>
  )
}
