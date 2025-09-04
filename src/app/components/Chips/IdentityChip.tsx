'use client'

import React from 'react'
import BaseChip, { BaseChipProps } from './BaseChip'

export interface IdentityChipProps extends BaseChipProps {
  parentId?: string | number | null
  slug: string
  identityType?: string
  children?: React.ReactNode
}

const IdentityChip: React.FC<IdentityChipProps> = ({
  parentId,
  slug,
  identityType,
  children,
  ...baseProps
}) => {
  const identityClasses = `
    ${baseProps.className || ''}
    ${parentId ? 'border-l-4 border-l-indigo-400' : ''}
  `

  return (
    <BaseChip
      {...baseProps}
      className={identityClasses.trim()}
    >      
      {children}
    </BaseChip>
  )
}

export default IdentityChip

