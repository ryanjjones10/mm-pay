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
    return undefined
  }
  return (
    <View
      style={{
        backgroundColor: colors.primaryBackground,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 25,
        paddingRight: 25,
        height: '100%',
      }}
    >
      {children}
    </View>
  )
}
