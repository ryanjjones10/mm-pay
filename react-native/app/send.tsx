import React, { useState } from 'react'
import { KeyboardAvoidingView, View, Text, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { isEmpty } from 'lodash'

import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import { useAccounts } from '@app/services/AccountStore'
import { button, colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import { inviteUser, useDispatch } from './services'
import { AccountType, ClaimObject, ClaimTo } from './types'
import { generateUUID, isNotEmpty } from './utils'
import Section from './components/ui/Section'
import { b64Encode } from './utils/claim'
import QRCode from 'react-qr-code'
import Card from './components/ui/Card'
import { useClaims } from './services/ClaimsStore'

export const Send = () => {
  const { account } = useAccounts()
  const { createClaim } = useClaims()
  const dispatch = useDispatch()
  const [claimToSend, setClaimToSend] = useState(
    undefined as ClaimObject | undefined,
  )

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
    inviteUser(account.privateKey, sendAmount).then((claim) => {
      if (!claim || isEmpty(claim)) return
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
        <View>
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
                    Have your friend scan this QR code to claim {sendAmount}{' '}
                    USDC
                  </Text>
                </View>
                <QRCode
                  value={`exp://192.168.0.17:19000?token=${b64Encode(
                    JSON.stringify(claimToSend),
                  )}`}
                />
              </Card>
            </View>
          ) : (
            <KeyboardAvoidingView>
              <View style={{ height: '100%', width: '100%' }}>
                <View
                  style={{
                    display: 'flex',
                    width: '100%',
                    padding: 10,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 30,
                      textAlign: 'center',
                    }}
                  >
                    {sendAmount === '0'
                      ? '$0'
                      : formatCurrency(parseFloat(sendAmount)).toString()}
                  </Text>
                </View>
                <View style={{ alignItems: 'baseline' }}>
                  <Keypad current={sendAmount} onChange={handleChange} />
                </View>
                <Pressable onPress={handleCreateClaimLink}>
                  <View
                    style={{
                      width: '100%',
                      margin: 10,
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
                      }}
                    />
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      Hold to create link
                    </Text>
                  </View>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      </Section>
    </Main>
  )
}

export default Send
