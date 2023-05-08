import { View, Text, Image } from 'react-native'
import BlockLogo from '@app/assets/blockLogo.png'
import { Avatar } from '@app/components/ui/Avatar'
import WalletValue from '@app/components/WalletValue'
import { colors } from '@app/styles/common'
import Button from '@app/components/ui/Button'
import Card from '@app/components/ui/Card'
import Section from '@app/components/ui/Section'
import TokenTable from '@app/components/TokenTable'
import { accountResponse } from '@app/services/account'
import { useFonts } from 'expo-font'

const Home = () => {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Roboto-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  const tokens = accountResponse.tokenBalances

  return (
    <View>
      <div
        style={{
          backgroundColor: colors.primaryBackground,
          padding: '20px 25px',
          height: '100vh',
          fontFamily: 'Roboto',
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
            <Avatar>A</Avatar>
          </div>
        </div>
        <Section>
          <WalletValue value={2540} />
        </Section>
        <Section>
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
        </Section>
        <Section>
          <Card>
            <div>
              <div style={{ marginBottom: '10px' }}>Tokens</div>
              <TokenTable tokens={tokens} />
            </div>
          </Card>
        </Section>
      </div>
    </View>
  )
}

export default Home
