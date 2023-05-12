import React, { useEffect, useState } from 'react'

import { polyfillWebCrypto } from 'expo-standard-web-crypto'
polyfillWebCrypto()

import '@ethersproject/shims'
import { Link } from 'expo-router'
import { Text, Image, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { isEmpty } from 'lodash'
import * as Linking from 'expo-linking'
import { Wallet } from '@ethersproject/wallet'

import BlockLogo from '@app/assets/blockLogo.png'
import { Avatar } from '@app/components/ui/Avatar'
import WalletValue from '@app/components/WalletValue'
import { button, colors } from '@app/styles/common'
import Card from '@app/components/ui/Card'
import Section from '@app/components/ui/Section'
import TokenTable from '@app/components/TokenTable'
import { Main } from '@app/components/layout/Main'
import { generateUUID } from '@app/utils'

import { useAccounts } from './services/AccountStore'
import Button from './components/ui/Button'
import {
  LINEA_ETH,
  LINEA_NETWORK_CONFIG,
  LINEA_TESTNET_CHAINID,
  LINEA_USDC,
  //contractTestAccountMeta,
} from './constants'
import { useDispatch } from './services/Store'
import { bigify, extractClaim } from './utils'
import {
  AccountType,
  ClaimTo,
  EOAStoreAccount,
  ITxStatus,
  ITxType,
  StoreAccount,
} from './types'
import { importedPrivateKey } from './constants/account'

import { IS_DEV } from './config'
import { useClaims } from './services/ClaimsStore'
import {
  ProviderHandler,
  deployNew4337DelegatableSmartAccount,
  executeUserOps,
  useInitialURL,
} from './services'
import TransactionsTable from './components/TransactionsTable'

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
  const {
    account,
    addNewUserFromClaim,
    updateAccount,
    upgradeAccountToContract,
    resetAccount,
  } = useAccounts()
  const { claims, createClaim } = useClaims()
  const dispatch = useDispatch()
  const url = Linking.useURL()
  const [status, setStatus] = useState('')

  const { url: initialUrl } = useInitialURL()
  console.debug('[Home]: initialUrl', initialUrl, '____', url)
  // handle new claim persistence
  useEffect(() => {
    if (initialUrl) {
      const { queryParams } = Linking.parse(initialUrl)

      if (queryParams && queryParams.token) {
        // extract claim, jsonify it and persist it in store
        const extractedClaim = extractClaim(queryParams.token) // extractClaim(queryParams.token) @todo: change back to extractDirectly instead of mock.
        console.debug(extractedClaim)
        // don't re-add existing claims
        setStatus(`
          'going to attempt to add n1',
          ${!extractedClaim},
          ${
            claims.find(
              ({ id }) => id === generateUUID(extractedClaim.privateKey),
            )
              ? isEmpty(
                  claims.find(
                    ({ id }) => id === generateUUID(extractedClaim.privateKey),
                  ),
                )
              : undefined
          }`)

        if (!extractedClaim) {
          setStatus('going to attempt to add now3')

          return
        }
        setStatus('going to attempt to add now2')
        if (!('privateKey' in account)) {
          setStatus('going to attempt to add now')
          addNewUserFromClaim(extractedClaim)(dispatch)
        } else {
          if (
            claims.find(
              ({ id }) => id === generateUUID(extractedClaim.privateKey),
            )
          ) {
            setStatus('claim already exists')
            return
          }
          setStatus('claim added')

          createClaim({
            id: generateUUID(extractedClaim.privateKey),
            data: extractedClaim,
            to: ClaimTo.ME,
            used: false,
          })
        }
      }
    }
  }, [initialUrl])
  const tokens = isEmpty(account) ? [] : formatTokens(account as StoreAccount)
  const totalValue = tokens.reduce(
    (acc, cur) => acc + parseFloat(cur.value.marketValue),
    0,
  )

  const invokeCreateAccount = (acc) => {
    /* @todo: remove test accounts */
    dispatch(updateAccount(acc))
  }
  //   const createTestContractAccountWithPrivateKey = () => {
  //     if (!importedPrivateKey || importedPrivateKey === '') {
  //       console.error(`No process.env.METAMASK_PAY_TEST_PRIVATE_KEY found'`)
  //       return
  //     }
  //     const wallet = new Wallet(importedPrivateKey)
  //     const newAccount = {
  //       ...contractTestAccountMeta,
  //       address: wallet.address,
  //       privateKey: importedPrivateKey,
  //     }
  //     invokeCreateAccount(newAccount)
  //   }

  const deploySmartAccountWallet = () => {
    if (account.type == AccountType.EOA) {
      new ProviderHandler(LINEA_NETWORK_CONFIG, true)
      const wallet = new Wallet(
        account.privateKey,
        ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG),
      )
      // If there is a delegatable claim that can be used to deploy the smart contract, then use the claim.
      const relevantClaim =
        claims.length !== 0 &&
        claims.find(
          (claim) =>
            claim.to === ClaimTo.ME &&
            claim.data.privateKey &&
            account.privateKey &&
            claim.data.privateKey === account.privateKey &&
            !claim.used,
        )
      console.debug('relevantClaim', !!relevantClaim, !isEmpty(relevantClaim))
      if (relevantClaim && !isEmpty(relevantClaim)) {
        const claimExecuteSuccess = executeUserOps(
          relevantClaim.data.privateKey,
          relevantClaim.data.contractAddress,
          relevantClaim.data.userOps,
        )
          .then((d) => {
            if (d) {
              console.info(
                `[deploySmartAccountWallet]: successfully deployed smart contract using claim id '${relevantClaim.id}'`,
              )
              return true
            }
          })
          .catch((e) => {
            console.error(
              '[deploySmartAccountWallet]: error deploying smart contract using claim',
              e,
            )
            return false
          })
        if (!claimExecuteSuccess) return
        upgradeAccountToContract(account, relevantClaim)
      } else {
        deployNew4337DelegatableSmartAccount(wallet).then(
          (smartContractAcc) => {
            if (!account) {
              console.error(`[deploySmartAccountWallet]: failed to deploy.`)
            }
            dispatch(
              updateAccount({
                ...account,
                contractAddress: smartContractAcc.address,
                type: AccountType.CONTRACT,
                transactions: {
                  ...account.transactions,
                  [smartContractAcc.deployTransaction.hash]: {
                    ...account.transactions[
                      smartContractAcc.deployTransaction.hash
                    ],
                    ...smartContractAcc.deployTransaction,
                    data: '', // remove this to not bloat stored state with contract deployment data
                    txType: ITxType.DEPLOY_SMART_ACCOUNT,
                    txStatus: ITxStatus.PENDING,
                  },
                },
              }),
            )
          },
        )
      }
    } else {
      console.error(
        'cant deploy smart contract - it either already exists or there is no signing key.',
      )
    }
  }

  const createTestAccountWithPrivateKey = () => {
    if (!importedPrivateKey || importedPrivateKey === '') {
      console.error(`No process.env.METAMASK_PAY_TEST_PRIVATE_KEY found'`)
      return
    }
    const wallet = new Wallet(importedPrivateKey)
    const newAccount: EOAStoreAccount = {
      address: wallet.address,
      privateKey: importedPrivateKey,
      chainId: LINEA_TESTNET_CHAINID,
      type: AccountType.EOA,
      transactions: {},
    }
    invokeCreateAccount(newAccount)
  }

  const resetAccountState = () => {
    dispatch(resetAccount())
  }

  //   const createNewAccount = () => {
  //     const wallet = createRandomWallet()
  //     const newAccount = {
  //       address: wallet.address,
  //       privateKey: wallet.privateKey,
  //       type: AccountType.EOA,
  //       chainId: LINEA_TESTNET_CHAINID,
  //     }
  //     invokeCreateAccount(newAccount)
  //   }

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
      <View>
        <Text style={{ color: colors.secondaryText }}>
          URL: {initialUrl} {initialUrl ?? initialUrl}
        </Text>
      </View>
      {claims.length !== 0 ? (
        <View>
          <Text style={{ marginLeft: 7, color: colors.text }}>
            {claims.length} Claims Present
          </Text>
        </View>
      ) : null}
      {status ? (
        <Text style={{ color: colors.secondaryText }}>status: {status}</Text>
      ) : null}
      {isEmpty(account) ? (
        <View>
          <Section>
            <View style={style.actionBar}>
              {/* <Button
                onClick={() => invokeCreateAccount(viewOnlyTestAccountNew)}
              >
                <Text>Create acc (test)</Text>
              </Button> */}
              <Button onClick={() => createTestAccountWithPrivateKey()}>
                <Text>Create acc (w/private key)</Text>
              </Button>
            </View>
          </Section>
          {/* <Section>
            <View style={style.actionBar}>
              <Button onClick={() => createTestContractAccountWithPrivateKey()}>
                <Text>Create acc (contract acc w/priv key)</Text>
              </Button>
              <Button onClick={() => createNewAccount()}>
                <Text>Create acc (generate new keypair)</Text>
              </Button>
            </View>
          </Section> */}
        </View>
      ) : (
        <View>
          {account.type === AccountType.EOA ? (
            <Section>
              <View style={style.actionBar}>
                <Button onClick={() => deploySmartAccountWallet()}>
                  <Text>Deploy Smart Account</Text>
                </Button>
              </View>
            </Section>
          ) : null}
          <Section>
            {totalValue !== undefined ? (
              <WalletValue
                value={totalValue.toFixed(2)}
                contractAddress={
                  account.type === AccountType.CONTRACT
                    ? account.contractAddress
                    : undefined
                }
                signerAddress={account.address}
              />
            ) : (
              <View>
                <Text>Loading...</Text>
              </View>
            )}
          </Section>
          {IS_DEV && (
            <Section>
              <View style={style.actionBar}>
                <Button onClick={() => resetAccountState()}>
                  <Text>Reset Account</Text>
                </Button>
              </View>
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
                    <Icon
                      name="send"
                      size={15}
                      style={{ color: colors.text }}
                    />
                    <Text style={{ marginLeft: 7, color: colors.text }}>
                      Send
                    </Text>
                  </View>
                </Link>
              </View>
            </View>
          </Section>
        </View>
      )}
      <Section>
        <Card style={{ backgroundColor: 'rgba(255, 255, 0, 0.15)' }}>
          <View>
            <View style={{ marginBottom: 10 }}>
              <Text style={style.cardHeader}>Time to secure your funds!</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View>
                <Text style={{ color: '#0096FF', fontWeight: '600' }}>
                  Secure your account
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Section>
      {!isEmpty(account) ? (
        <View>
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
          {Object.keys(account.transactions).length !== 0 ? (
            <Section>
              <Card>
                <View>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={style.cardHeader}>Transactions</Text>
                  </View>
                  <TransactionsTable
                    transactions={Object.values(account.transactions)}
                  />
                </View>
              </Card>
            </Section>
          ) : null}
        </View>
      ) : null}
    </Main>
  )
}

export default Home
