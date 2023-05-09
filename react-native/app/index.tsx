import { polyfillWebCrypto } from 'expo-standard-web-crypto'
polyfillWebCrypto()

import '@ethersproject/shims'
import { Link } from 'expo-router'
import { Text, Image, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import BlockLogo from '@app/assets/blockLogo.png'
import { Avatar } from '@app/components/ui/Avatar'
import WalletValue from '@app/components/WalletValue'
import { button, colors } from '@app/styles/common'
import Card from '@app/components/ui/Card'
import Section from '@app/components/ui/Section'
import TokenTable from '@app/components/TokenTable'
import { Main } from '@app/components/layout/Main'
import { useAccounts } from './services/AccountStore'
import Button from './components/ui/Button'
import {
  LINEA_ETH,
  LINEA_TESTNET_CHAINID,
  LINEA_USDC,
  testAccountNew,
} from './constants'
import { useDispatch } from './services/Store'
import { bigify, isEmpty } from './utils'
import { StoreAccount } from './types'
import { createRandomWallet } from './utils/createRandom'
import { importedPrivateKey } from './constants/account'
import { Wallet } from '@ethersproject/wallet'

const formatTokens = (account: StoreAccount) =>
  [
    {
      ...LINEA_USDC,
      balance: bigify(account.usdcBalance) ?? undefined,
      value: {
        marketValue: bigify(account.usdcBalance)
          .multipliedBy(bigify(account.usdcRate))
          .toFixed(2),
      },
    },
    {
      ...LINEA_ETH,
      balance: bigify(account.nativeBalance) ?? undefined,
      value: {
        marketValue: bigify(account.nativeBalance)
          .multipliedBy(bigify(account.nativeRate))
          .toFixed(2),
      },
    },
  ].filter((token) => token.balance?.gt(0))

const Home = () => {
  const { account, updateAccount } = useAccounts()
  const dispatch = useDispatch()

  const tokens = formatTokens(account)
  const totalValue = tokens.reduce(
    (acc, cur) => acc + parseFloat(cur.value.marketValue),
    0,
  )
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
      backgroundColor: colors.primaryBrand,
    },
    cardHeader: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '600',
    },
  })

  const invokeCreateAccount = (acc) => {
    /* @todo: remove test accounts */
    dispatch(updateAccount(acc))
  }

  const createTestAccountWithPrivateKey = () => {
    console.debug('createTestAccountWithPrivateKey invoked')
    if (!importedPrivateKey || importedPrivateKey === '') {
      console.error('No process.env.METAMASK_PAY_TEST_PRIVATE_KEY found')
      return
    }
    const wallet = new Wallet(importedPrivateKey)
    const newAccount = {
      address: wallet.address,
      privateKey: importedPrivateKey,
      chainId: LINEA_TESTNET_CHAINID,
    }
    invokeCreateAccount(newAccount)
  }

  const createNewAccount = () => {
    const wallet = createRandomWallet()
    const newAccount = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      chainId: LINEA_TESTNET_CHAINID,
    }
    invokeCreateAccount(newAccount)
  }

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
      {isEmpty(account) ? (
        <Section>
          <View style={style.actionBar}>
            <Button onClick={() => invokeCreateAccount(testAccountNew)}>
              <Text>Create acc (test)</Text>
            </Button>
            <Button onClick={() => createTestAccountWithPrivateKey()}>
              <Text>Create acc (w/private key)</Text>
            </Button>
            <Button onClick={() => createNewAccount()}>
              <Text>Create acc (generate new keypair)</Text>
            </Button>
          </View>
        </Section>
      ) : (
        <Section>
          {totalValue !== undefined ? (
            <WalletValue
              value={totalValue.toFixed(2)}
              address={account.address}
            />
          ) : (
            <Text>Loading...</Text>
          )}
        </Section>
      )}

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
                <Icon name="send" size={15} style={{ color: colors.text }} />
                <Text style={{ marginLeft: 7, color: colors.text }}>Send</Text>
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
