'use client'

import React from 'react'
import IdentityChip, { IdentityChipProps } from './IdentityChip'

export interface EconomicIdentityChipProps extends IdentityChipProps {
  incomeRange?: {
    low: number
    high: number
  }
}

const EconomicIdentityChip: React.FC<EconomicIdentityChipProps> = ({
  incomeRange,
  ...identityProps
}) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const economicClasses = `
    ${identityProps.className || ''}
    border-green-500 bg-green-50 hover:bg-green-100 hover:border-green-600
  `

  return (
    <IdentityChip
      {...identityProps}
      className={economicClasses.trim()}
      identityType="Economic"
    >
      {incomeRange && (
        <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
          {formatCurrency(incomeRange.low)} - {formatCurrency(incomeRange.high)}
        </div>
      )}
    </IdentityChip>
  )
}

export default EconomicIdentityChip

