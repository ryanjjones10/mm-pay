import { Main } from '@app/components/layout/Main'
import Card from '@app/components/ui/Card'
import React from 'react'
import QRCode from 'react-qr-code'

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
        <div style={{ marginBottom: '20px' }}>Account Address</div>
        <QRCode value="accountAddress" />
      </Card>
    </Main>
  )
}

export default Receive
