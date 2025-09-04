'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface EducationalIdentityChipProps extends IdentityChipProps {
  // Educational-specific fields can be added here in the future
}

const EducationalIdentityChip: React.FC<EducationalIdentityChipProps> = (props) => {
  const educationalClasses = `
    ${props.className || ''}
    border-purple-500 bg-purple-50 hover:bg-purple-100 hover:border-purple-600
  `

  return (
    <IdentityChip
      {...props}
      className={educationalClasses.trim()}
      identityType="Educational"
    />
  )
}

export default EducationalIdentityChip

