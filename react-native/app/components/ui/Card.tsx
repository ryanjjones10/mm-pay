import { colors } from '@app/styles/common'
import React, { ReactElement } from 'react'

function Card({ children }: { children: ReactElement }) {
  return (
    <div
      style={{
        backgroundColor: colors.secondaryBackground,
        padding: '1.25rem',
        borderRadius: '1rem',
        color: colors.text,
      }}
    >
      {children}
    </div>
  )
}

export default Card
