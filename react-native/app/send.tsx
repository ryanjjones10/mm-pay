import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import { button, colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export const Send = () => {
  const [sendAmount, setSendAmount] = useState('0')

  const handleChange = (e) => {
    setSendAmount(e)
  }
  return (
    <Main>
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
          <View
            style={{
              width: '100%',
              margin: 10,
              backgroundColor: colors.primaryBrand,
              justifyContent: 'center',
              ...button,
            }}
          >
            <Link href="/claimLink">
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
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Main>
  )
}

export default Send
