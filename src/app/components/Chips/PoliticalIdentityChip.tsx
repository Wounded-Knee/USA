'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface PoliticalIdentityChipProps extends IdentityChipProps {
  // Political-specific fields can be added here in the future
}

const PoliticalIdentityChip: React.FC<PoliticalIdentityChipProps> = (props) => {
  const politicalClasses = `
    ${props.className || ''}
    border-red-500 bg-red-50 hover:bg-red-100 hover:border-red-600
  `

  return (
    <IdentityChip
      {...props}
      className={politicalClasses.trim()}
      identityType="Political"
    />
  )
}

export default PoliticalIdentityChip

