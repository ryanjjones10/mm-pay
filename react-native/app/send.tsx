import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import Button from '@app/components/ui/Button'
import { colors } from '@app/styles/common'
import { formatCurrency } from '@app/utils/currency'
import React, { useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'

export const Send = () => {
  const [sendAmount, setSendAmount] = useState('0')

  const handleChange = (e) => {
    setSendAmount(e)
  }
  return (
    <Main>
      <KeyboardAvoidingView>
        <div style={{ height: '100vh', justifyItems: 'baseline' }}>
          <div
            style={{
              display: 'flex',
              justifyItems: 'center',
              textAlign: 'center',
              width: '100%',
              padding: '60px 0px',
            }}
          >
            <div
              style={{
                color: colors.text,
                fontSize: '2rem',
                display: 'flex',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {formatCurrency(sendAmount)}
            </div>
          </div>
          <div style={{ alignItems: 'baseline' }}>
            <Keypad onChange={handleChange} />
          </div>
          <Button style={{ width: '100%', margin: '20px 0px' }}>
            Hold to create link
          </Button>
        </div>
      </KeyboardAvoidingView>
    </Main>
  )
}

export default Send
