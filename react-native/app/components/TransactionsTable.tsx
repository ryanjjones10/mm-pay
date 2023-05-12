import { isEmpty } from 'lodash'
import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { colors } from '@app/styles/common'

import Address from './Address'
import { ExtendedTxResponse } from '@app/types'
import { Link } from 'expo-router'
import { toUppercaseFirst } from '@app/utils/firstUpper'
import { truncate } from '@app/utils'

function TransactionsTable({
  transactions,
}: {
  transactions: ExtendedTxResponse[]
}) {
  console.debug(transactions)
  return (
    <View style={{ marginRight: 0, width: '100%' }}>
      {transactions
        ?.filter(
          (transaction) =>
            !isEmpty(transaction) &&
            'hash' in transaction &&
            'txStatus' in transaction &&
            'txType' in transaction,
        )
        .map((transaction, i) => {
          const { hash, txStatus, txType } = transaction
          return (
            <View
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                paddingTop: 8,
                paddingBottom: 8,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View>
                  <View>
                    <View style={{ marginRight: 10, flexDirection: 'row' }}>
                      <Link
                        href={`https://explorer.goerli.linea.build/tx/${hash}`}
                      >
                        <View>
                          <Icon
                            name="external-link"
                            size={15}
                            style={{ color: colors.text }}
                          />
                        </View>
                        <Text
                          style={{
                            fontWeight: '600',
                            marginLeft: 10,
                            color: colors.text,
                          }}
                        >
                          {hash ? (
                            <Address
                              address={truncate(hash)}
                              isCopyable={false}
                            />
                          ) : null}
                        </Text>
                      </Link>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    fontWeight: '600',
                    color: colors.secondaryText,
                    textAlign: 'right',
                  }}
                >
                  {`Transaction Type: ${toUppercaseFirst(
                    txType.replaceAll('_', ' ').toLowerCase(),
                  )}`}
                </Text>
                <Text
                  style={{
                    fontWeight: '600',
                    color: colors.secondaryText,
                    textAlign: 'right',
                  }}
                >
                  {`Transaction Status: ${toUppercaseFirst(
                    txStatus.toLowerCase(),
                  )}`}
                </Text>
              </View>
            </View>
          )
        })}
    </View>
  )
}

export default TransactionsTable
