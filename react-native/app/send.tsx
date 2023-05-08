import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import Button from '@app/components/ui/Button'
import { colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'

export const Send = () => {
  const [sendAmount, setSendAmount] = useState('0')

  const handleChange = (e) => {
    setSendAmount(e)
  }
  return (
    <Main>
      <KeyboardAvoidingView>
        <View style={{ height: '100vh' }}>
          <View
            style={{
              display: 'flex',
              textAlign: 'center',
              width: '100%',
              padding: 60,
            }}
          >
            <View
              style={{
                color: colors.text,
                fontSize: 30,
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {formatCurrency(sendAmount)}
            </View>
          </View>
          <View style={{ alignItems: 'baseline' }}>
            <Keypad onChange={handleChange} />
          </View>
          <Link href="/claimLink">
            <Button style={{ width: '100%', margin: '20px 0px' }}>
              Hold to create link
            </Button>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Main>
  )
}

export default Send
