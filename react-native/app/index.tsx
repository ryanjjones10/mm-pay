import { Text, Image, View, StyleSheet } from 'react-native'
import BlockLogo from '@app/assets/blockLogo.png'
import { Avatar } from '@app/components/ui/Avatar'
import WalletValue from '@app/components/WalletValue'
import { button, colors } from '@app/styles/common'
import Button from '@app/components/ui/Button'
import Card from '@app/components/ui/Card'
import Section from '@app/components/ui/Section'
import TokenTable from '@app/components/TokenTable'
import { accountResponse } from '@app/services/account'
import { Link } from 'expo-router'
import { Main } from '@app/components/layout/Main'
import Icon from 'react-native-vector-icons/FontAwesome'

const Home = () => {
  const tokens = accountResponse.tokenBalances

  const style = StyleSheet.create({
    header: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    brand: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      height: 25,
      width: 25,
    },
    actionBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButton: {
      ...button,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'inherit',
    },
    primaryButton: {
      ...button,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:colors.primaryBrand
    },
    cardHeader: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '600',
    },
  })

  return (
    <Main>
      <View style={style.header}>
        <View style={style.brand}>
          <Image source={BlockLogo} style={style.logo} />
          <Text style={{ marginLeft: 7, color: colors.text }}>Pay</Text>
        </View>
        <View>
          <Avatar>
            <Text>A</Text>
          </Avatar>
        </View>
      </View>
      <Section>
        <WalletValue value={2540} />
      </Section>
      <Section>
        <View style={style.actionBar}>
          <View style={{ marginRight: 10 }}>
            <Link href="/receive">
              <View style={style.secondaryButton}>
                <Icon
                  name="qrcode"
                  size={15}
                  style={{ color: colors.primaryBrand }}
                />
                <Text style={{ marginLeft: 7, color: colors.primaryBrand }}>
                  Receive
                </Text>
              </View>
            </Link>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Link href="/send">
              <View style={style.primaryButton}>
                <Icon name="send" size={15} />
                <Text style={{ marginLeft: 7 }}>Send</Text>
              </View>
            </Link>
          </View>
        </View>
      </Section>
      <Section>
        <Card>
          <View>
            <View style={{ marginBottom: 10 }}>
              <Text style={style.cardHeader}>Tokens</Text>
            </View>
            <TokenTable tokens={tokens} />
          </View>
        </Card>
      </Section>
    </Main>
  )
}

export default Home
