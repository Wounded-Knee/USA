'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface SexualIdentityChipProps extends IdentityChipProps {
  // Sexual identity-specific fields can be added here in the future
}

const SexualIdentityChip: React.FC<SexualIdentityChipProps> = (props) => {
  const sexualIdentityClasses = `
    ${props.className || ''}
    border-rose-500 bg-rose-50 hover:bg-rose-100 hover:border-rose-600
  `

  return (
    <IdentityChip
      {...props}
      className={sexualIdentityClasses.trim()}
      identityType="Sexual"
    />
  )
}

export default SexualIdentityChip

