import { Main } from '@app/components/layout/Main'
import Card from '@app/components/ui/Card'
import React from 'react'
import QRCode from 'react-qr-code'
import { View, Text } from 'react-native'
import { colors } from '@app/styles/common'

const Receive = () => {
  return (
    <Main>
      <Card
        style={{
          alignItems: 'center',
          justifyItems: 'center',
          textAlign: 'center',
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ marginLeft: 7, color: colors.text }}>
            Account Address
          </Text>
        </View>
        <QRCode value="accountAddress" />
      </Card>
    </Main>
  )
}

export default Receive
