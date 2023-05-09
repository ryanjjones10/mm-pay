import { colors } from '@app/styles/common'
import { convertToFiat } from '@app/utils'
import { formatCurrency } from '@app/utils/currency'
import React from 'react'
import { Image, Text, View } from 'react-native'

function TokenTable({ tokens }: { tokens: any }) {
  return (
    <View style={{ marginRight: 0, width: '100%' }}>
      {tokens?.map((token, i) => {
        const { symbol, name, iconUrl, balance, value } = token
        return (
          <View
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: iconUrl }}
                style={{ height: 32, width: 32, marginRight: 10 }}
              />
              <View>
                <View>
                  <Text style={{ fontWeight: '600', color: colors.text }}>
                    {symbol}
                  </Text>
                </View>
                <Text style={{ color: colors.secondaryText }}>{name}</Text>
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <View>
                <Text
                  style={{
                    fontWeight: '600',
                    color: colors.text,
                    textAlign: 'right',
                  }}
                >
                  {formatCurrency(
                    convertToFiat(value.marketValue, 1).toNumber(),
                  )}
                </Text>
                <Text
                  style={{
                    color: colors.secondaryText,
                    textAlign: 'right',
                  }}
                >
                  {parseFloat(balance?.toPrecision(6))} {symbol}
                </Text>
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default TokenTable
