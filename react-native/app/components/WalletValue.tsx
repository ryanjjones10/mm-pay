import React from 'react'
import { Text, View } from 'react-native'
import { colors } from '@app/styles/common'
import Address from '@app/components/Address'
import { convertToFiat } from '@app/utils'
import { formatCurrency } from '@app/utils/currency'

export default function WalletValue({
  contractAddress,
  signerAddress,
  value,
}: {
  contractAddress?: string
  signerAddress: string
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
      {signerAddress ? (
        <View style={{ flexDirection: 'row' }}>
          {contractAddress ? (
            <Text
              style={{ fontSize: 20, fontWeight: '400', color: colors.text }}
            >
              Signer:
            </Text>
          ) : null}
          <Address address={signerAddress} isCopyable={true} />
        </View>
      ) : null}
      {contractAddress ? (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 20, fontWeight: '400', color: colors.text }}>
            Contract:
          </Text>
          <Address address={contractAddress} isCopyable={true} />
        </View>
      ) : null}
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
