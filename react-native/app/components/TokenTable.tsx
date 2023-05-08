import { colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import React from 'react'
import { Image } from 'react-native'

function TokenTable({ tokens }: { tokens: any }) {
  return (
    <table style={{ marginRight: '0px', width: '100%' }}>
      {tokens?.map((token) => {
        const { symbol, name, iconUrl, balance, value } = token
        return (
          <tr>
            <td style={{ padding: '10px 0px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  source={{ uri: iconUrl }}
                  style={{ height: '32px', width: '32px', marginRight: '10px' }}
                />
                <div>
                  <div style={{ fontWeight: 600 }}>{symbol}</div>
                  <div style={{ color: colors.secondaryText }}>{name}</div>
                </div>
              </div>
            </td>
            <td style={{ padding: '10px 0px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>
                  {formatCurrency(value?.marketValue)}
                </div>
                <div
                  style={{
                    textOverflow: 'ellipsis',
                    color: colors.secondaryText,
                  }}
                >
                  {balance?.toPrecision(6)} {symbol}
                </div>
              </div>
            </td>
          </tr>
        )
      })}
    </table>
  )
}

export default TokenTable
