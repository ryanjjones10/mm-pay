import Keypad from '@app/components/Keypad'
import { Main } from '@app/components/layout/Main'
import Button from '@app/components/ui/Button'
import React from 'react'
import { KeyboardAvoidingView, TextInput } from 'react-native'

export const Send = () => {
  return (
    <Main>
      <KeyboardAvoidingView>
        <div style={{ height: '100vh', justifyItems: 'baseline' }}>
          <TextInput keyboardAppearance="dark" />
          <div style={{ alignItems: 'baseline' }}>
            <Keypad />
          </div>
          <Button style={{ width: '100%' }}>Hold to create link</Button>
        </div>
      </KeyboardAvoidingView>
    </Main>
  )
}

export default Send
