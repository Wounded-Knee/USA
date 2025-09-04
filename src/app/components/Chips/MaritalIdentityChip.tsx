'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface MaritalIdentityChipProps extends IdentityChipProps {
  // Marital-specific fields can be added here in the future
}

const MaritalIdentityChip: React.FC<MaritalIdentityChipProps> = (props) => {
  const maritalClasses = `
    ${props.className || ''}
    border-pink-500 bg-pink-50 hover:bg-pink-100 hover:border-pink-600
  `

  return (
    <IdentityChip
      {...props}
      className={maritalClasses.trim()}
      identityType="Marital"
    />
  )
}

export default MaritalIdentityChip

