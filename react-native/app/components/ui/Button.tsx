import React from 'react'
import { colors } from '@app/styles/common'

function Button({
  variant = 'primary',
  style,
  children,
}: {
  variant?: 'primary' | 'secondary'
  style: any
  children: string
}) {
  return (
    <button
      style={{
        backgroundColor: variant === 'primary' ? colors.primaryBrand : 'white',
        color: variant === 'primary' ? colors.text : colors.primaryBrand,
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '25px',
        lineHeight: '1.25rem',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export default Button
