import { View, Text, Image } from 'react-native'
import BlockLogo from './assets/blockLogo.png'
import { Avatar } from '@app/components/Avatar'
import WalletValue from '@app/components/WalletValue'
import { colors } from '@app/styles/common'
import Button from '@app/components/Button'

const Home = () => {
  return (
    <View>
      <div
        style={{
          backgroundColor: colors.primaryBackground,
          padding: '20px 25px',
          height: '100vh',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: ' space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              source={BlockLogo}
              style={{ height: '25px', width: '25px' }}
            />
            <Text style={{ marginLeft: '7px', color: colors.text }}>Pay</Text>
          </div>
          <div>
            <Avatar />
          </div>
        </div>
        <div style={{ margin: '20px 0px' }}>
          <WalletValue value={2540} />
        </div>
        <div style={{ margin: '20px 0px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: ' center',
            }}
          >
            <Button style={{ margin: '0px 10px' }}>Receive</Button>
            <Button style={{ margin: '0px 10px' }} variant="secondary">
              Send
            </Button>
          </div>
        </div>
      </div>
    </View>
  )
}

export default Home
