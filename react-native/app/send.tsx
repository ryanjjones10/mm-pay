import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import { addRawData } from '@app/constants/realmQuery'
import { useAccounts } from '@app/services/AccountStore'
import { button, colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import QRCode from 'react-qr-code'
import Card from './components/ui/Card'
import Section from './components/ui/Section'
import { LINEA_USDC } from './constants'
import { inviteUser, useDispatch } from './services'
import { useClaims } from './services/ClaimsStore'
import { AccountType, ClaimTo } from './types'
import { isNotEmpty } from './utils'
import { b64Encode } from './utils/claim'
import { desktopAppConfig } from './config'

export const Send = () => {
  const { account } = useAccounts()
  const { createClaim } = useClaims()
  const dispatch = useDispatch()
  const [claimIDToSend, setClaimIdToSend] = useState(
    undefined as string | undefined,
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

      console.log('claim', claim)
      addRawData(claim)
        .then((claimId) => {
          setClaimIdToSend(claimId)
          dispatch(
            createClaim({
              id: claimId,
              data: claim,
              used: false,
              to: ClaimTo.OTHER,
            }),
          )
          setError(undefined)
        })
        .catch((e) => {
          console.error(`Error adding claim to store ${JSON.stringify(e)}`)
          setError(e)
        })
    })
  }
  const url = claimIDToSend
    ? `exp://${desktopAppConfig.ip}:${desktopAppConfig.port}?token=${b64Encode(
        claimIDToSend,
      )}`
    : ''
  return (
    <Main>
      <Section>
        <View style={{ height: '100%' }}>
          {claimIDToSend && isNotEmpty(claimIDToSend) && url && (
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
                <Text style={{ color: colors.text }}>{url}</Text>
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: colors.white,
                    padding: 20,
                  }}
                >
                  <QRCode value={url} />
                </View>
              </Card>
            </View>
          )}
          {!claimIDToSend && (
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
          )}
          {error && (
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
          )}
        </View>
      </Section>
    </Main>
  )
}

export default Send
