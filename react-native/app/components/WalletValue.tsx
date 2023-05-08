import { formatCurrency } from '@app/utils/currency'
import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '@app/styles/common'
import Address from '@app/components/Address'

export default function WalletValue({
  address,
  value,
}: {
  address: string
  value: number
}) {
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Address address={address} isCopyable={true} />
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
