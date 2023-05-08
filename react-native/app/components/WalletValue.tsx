import { formatCurrency } from '@app/utils/currency'
import React from 'react'
import { colors } from '@app/styles/common'
import { Text, View } from 'react-native'

export default function WalletValue({ value }: { value: number }) {
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 35,
          fontWeight: '600',
        }}
      >
        {formatCurrency(value)}
      </Text>
    </View>
  )
}
