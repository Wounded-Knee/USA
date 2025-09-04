'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface IndustrialIdentityChipProps extends IdentityChipProps {
  // Industrial-specific fields can be added here in the future
}

const IndustrialIdentityChip: React.FC<IndustrialIdentityChipProps> = (props) => {
  const industrialClasses = `
    ${props.className || ''}
    border-orange-500 bg-orange-50 hover:bg-orange-100 hover:border-orange-600
  `

  return (
    <IdentityChip
      {...props}
      className={industrialClasses.trim()}
      identityType="Industrial"
    />
  )
}

export default IndustrialIdentityChip

