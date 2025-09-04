'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface RacialIdentityChipProps extends IdentityChipProps {
  // Racial-specific fields can be added here in the future
}

const RacialIdentityChip: React.FC<RacialIdentityChipProps> = (props) => {
  const racialClasses = `
    ${props.className || ''}
    border-amber-500 bg-amber-50 hover:bg-amber-100 hover:border-amber-600
  `

  return (
    <IdentityChip
      {...props}
      className={racialClasses.trim()}
      identityType="Racial"
    />
  )
}

export default RacialIdentityChip

