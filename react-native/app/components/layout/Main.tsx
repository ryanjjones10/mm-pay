import { colors } from '@app/styles/common'
import React, { ReactElement } from 'react'
import { View } from 'react-native'

export const Main = ({ children }: { children: ReactElement }) => {
  return (
    <View>
      <div
        style={{
          backgroundColor: colors.primaryBackground,
          padding: '20px 25px',
          height: '100vh',
          fontFamily: 'Roboto',
        }}
      >
        {children}
      </div>
    </View>
  )
}
