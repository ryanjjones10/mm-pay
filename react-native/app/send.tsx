import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { isEmpty } from 'lodash'

import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import { useAccounts } from '@app/services/AccountStore'
import { button, colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import { inviteUser, useDispatch } from './services'
import { AccountType, ClaimStruct, ClaimTo } from './types'
import { generateUUID, isNotEmpty } from './utils'
import Section from './components/ui/Section'
import Card from './components/ui/Card'
import { useClaims } from './services/ClaimsStore'
import { LINEA_USDC, testUUID } from './constants'
import QRCode from 'react-qr-code'
import { b64Encode } from './utils/claim'

export const Send = () => {
  const { account } = useAccounts()
  const { createClaim } = useClaims()
  const dispatch = useDispatch()
  const [claimToSend, setClaimToSend] = useState(
    undefined as ClaimStruct | undefined,
  )
  const [error, setError] = useState(undefined as Error | undefined)

  const style = StyleSheet.create({
    secondaryButton: {
      ...button,
      backgroundColor: colors.secondaryBackground,
      borderWidth: 0,
      paddingLeft: 6,
      paddingRight: 6,
      paddingTop: 4,
      paddingBottom: 4,
      borderRadius: 25,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

  const [sendAmount, setSendAmount] = useState('0')

  const handleChange = (e) => {
    setSendAmount(e)
  }
  const handleCreateClaimLink = () => {
    if (sendAmount === '0') {
      console.error('no send amount specified')
      return
    }
    if (account.type === AccountType.VIEW_ONLY) {
      console.log('can not sign, this is a view-only account')
      return
    }
    if (account.type === AccountType.EOA) {
      console.debug('sending is turned off for EOA accounts for hackathon.')
      return
    }
    inviteUser(account, sendAmount).then((d) => {
      const { claim, error } = d
      if (!claim || isEmpty(claim) || error) {
        setError(error)
        return
      }
      dispatch(
        createClaim({
          id: generateUUID(claim.privateKey),
          data: claim,
          used: false,
          to: ClaimTo.OTHER,
        }),
      )
      setClaimToSend(claim)
    })
  }

  return (
    <Main>
      <Section>
        <View style={{ height: '100%' }}>
          {claimToSend && isNotEmpty(claimToSend) ? (
            <View>
              <Card
                style={{
                  alignItems: 'center',
                  justifyItems: 'center',
                  textAlign: 'center',
                }}
              >
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ marginBottom: 20, color: colors.text }}>
                    Send your friend this link to claim {sendAmount} USDC
                  </Text>
                </View>
                <Text style={{ color: colors.text }}>
                  exp://192.168.0.17:19000?token={b64Encode(testUUID)}
                </Text>
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: colors.white,
                    padding: 20,
                  }}
                >
                  <QRCode
                    value={`exp://192.168.0.17:19000?token=${b64Encode(
                      testUUID,
                    )}`}
                  />
                </View>
              </Card>
            </View>
          ) : null}
          {!claimToSend ? (
            <KeyboardAvoidingView>
              <View style={{ height: '100%', width: '100%' }}>
                <View
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    padding: 15,
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      width: '100%',
                      padding: 15,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontSize: 34,
                        textAlign: 'center',
                        fontWeight: '600',
                      }}
                    >
                      {sendAmount === '0'
                        ? '$0'
                        : formatCurrency(parseFloat(sendAmount)).toString()}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <View style={style.secondaryButton}>
                      <Image
                        source={{ uri: LINEA_USDC.iconUrl }}
                        style={{ height: 24, width: 24, marginRight: 7 }}
                      />
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 14,
                          marginRight: 7,
                          color: colors.text,
                        }}
                      >
                        {LINEA_USDC.ticker ?? 'Unknown Ticker'}
                      </Text>
                      <Icon
                        name="chevron-down"
                        size={10}
                        style={{
                          color: colors.text,
                          textAlign: 'center',
                          marginRight: 7,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginBottom: 10,
                  }}
                >
                  <Keypad current={sendAmount} onChange={handleChange} />
                </View>
                <Pressable onPress={handleCreateClaimLink}>
                  <View
                    style={{
                      width: '100%',
                      margin: 15,
                      backgroundColor: colors.primaryBrand,
                      justifyContent: 'center',
                      display: 'flex',
                      flexDirection: 'row',
                      ...button,
                    }}
                  >
                    <Icon
                      name="magic"
                      size={16}
                      style={{
                        color: colors.text,
                        textAlign: 'center',
                        marginRight: 7,
                      }}
                    />
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      Click to create link
                    </Text>
                  </View>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          ) : null}
          {error ? (
            <View>
              <Text
                style={{
                  color: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
              >
                Error {error.message}
              </Text>
            </View>
          ) : null}
        </View>
      </Section>
    </Main>
  )
}

export default Send
