import { colors } from '@app/styles/common'
import React, { ReactElement } from 'react'
import { View } from 'react-native'

function Card({
  children,
  style,
}: {
  children: ReactElement | ReactElement[]
  style?: any
}) {
  return (
    <View
      style={{
        backgroundColor: colors.secondaryBackground,
        padding: 20,
        borderRadius: 15,
        color: colors.text,
        ...style,
      }}
    >
      {children}
    </View>
  )
}

export default Card
