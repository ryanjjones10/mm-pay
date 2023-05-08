import React, { ReactElement } from 'react'
import { colors } from '@app/styles/common'

function Button({
  variant = 'primary',
  style,
  children,
}: {
  variant?: 'primary' | 'secondary'
  style?: any
  children: string | ReactElement
}) {
  return (
    <button
      style={{
        backgroundColor:
          variant === 'primary' ? colors.primaryBrand : 'inherit',
        border: '1px solid ' + colors.primaryBrand,
        color: variant === 'primary' ? colors.white : colors.primaryBrand,
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
