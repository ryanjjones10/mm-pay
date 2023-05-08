import React, { ReactElement } from 'react'
import { colors } from '@app/styles/common'
import { Pressable } from 'react-native'

export default function ({
  variant = 'primary',
  onClick,
  style,
  children,
}: {
  variant?: 'primary' | 'secondary'
  onClick?: any
  style?: any
  children: string | ReactElement
}) {
  return (
    <Pressable
      onPress={onClick}
      style={{
        backgroundColor:
          variant === 'primary' ? colors.primaryBrand : 'inherit',
        borderColor: colors.primaryBrand,
        borderWidth: 1,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      {children}
    </Pressable>
  )
}
