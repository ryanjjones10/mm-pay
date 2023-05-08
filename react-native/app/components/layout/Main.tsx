import { colors } from '@app/styles/common'
import { useFonts } from 'expo-font'
import React, { ReactElement } from 'react'
import { View } from 'react-native'

export const Main = ({
  children,
}: {
  children: ReactElement | ReactElement[]
}) => {
  const [fontsLoaded] = useFonts({
    Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return <div></div>
  }
  return (
    <View style={{}}>
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
