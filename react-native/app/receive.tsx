import { Main } from '@app/components/layout/Main'
import Card from '@app/components/ui/Card'
import React from 'react'
import QRCode from 'react-qr-code'
import { View } from 'react-native'
import { useAccounts } from '@app/services/AccountStore'
import Address from '@app/components/Address'

const Receive = () => {
  const { account } = useAccounts()
  const accountAddress = account?.address
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
          <Address address={accountAddress} isCopyable={true} />
        </View>
        <QRCode value={accountAddress} />
      </Card>
    </Main>
  )
}

export default Receive
