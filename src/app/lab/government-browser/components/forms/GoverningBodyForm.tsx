'use client'

import React from 'react'

interface GoverningBodyFormProps {
  onSubmit?: (data: any) => void
  initialData?: any
}

export default function GoverningBodyForm({ onSubmit, initialData }: GoverningBodyFormProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Governing Body Form</h3>
      <p className="text-gray-600">Form component placeholder - to be implemented</p>
    </div>
  )
}
