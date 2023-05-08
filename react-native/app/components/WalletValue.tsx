import { formatCurrency } from '@app/utils/currency'
import React from 'react'
import { colors } from '@app/styles/common'

export default function WalletValue({ value }: { value: number }) {
  return (
    <div
      style={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        fontSize: '3rem',
        fontWeight: 600,
        color: colors.text,
      }}
    >
      {formatCurrency(value)}
    </div>
  )
}
