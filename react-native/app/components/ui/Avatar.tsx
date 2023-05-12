import { ReactElement } from 'react'
import { View } from 'react-native'

export const Avatar = ({ children }: { children: ReactElement | string }) => (
  <View
    style={{
      height: 30,
      width: 30,
      backgroundColor: '#22c55e',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    }}
  >
    {children}
  </View>
)
