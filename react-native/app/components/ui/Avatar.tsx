import { ReactElement } from 'react'

export const Avatar = ({ children }: { children: ReactElement | string }) => (
  <div
    style={{
      height: '30px',
      width: '30px',
      borderRadius: '100%',
      backgroundColor: '#22c55e',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    }}
  >
    {children}
  </div>
)
