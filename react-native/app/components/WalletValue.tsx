import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '@app/styles/common'
import Address from '@app/components/Address'
import { convertToFiat } from '@app/utils'
import { formatCurrency } from '@app/utils/currency'

export default function WalletValue({
  address,
  value,
}: {
  address: string
  value: string
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
        {formatCurrency(convertToFiat(value, 1).toNumber())}
      </Text>
    </View>
  )
}
