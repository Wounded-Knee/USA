'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface ReligiousIdentityChipProps extends IdentityChipProps {
  // Religious-specific fields can be added here in the future
}

const ReligiousIdentityChip: React.FC<ReligiousIdentityChipProps> = (props) => {
  const religiousClasses = `
    ${props.className || ''}
    border-emerald-500 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-600
  `

  return (
    <IdentityChip
      {...props}
      className={religiousClasses.trim()}
      identityType="Religious"
    />
  )
}

export default ReligiousIdentityChip

