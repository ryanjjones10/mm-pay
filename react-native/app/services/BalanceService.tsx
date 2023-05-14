import {
  LINEA_NETWORK_CONFIG,
  LINEA_USDC,
  testNativeRate,
  testUSDCRate,
} from '@app/constants'
import { ProviderHandler } from './EthService'
import { StoreAccount } from '@app/types'

// @todo: This is a hack to get the USDC balance for the account
export const getAccountUSDCBalance = async (
  provider: ProviderHandler,
  account: StoreAccount,
) => {
  const balance = await provider.getTokenBalance(
    'contractAddress' in account ? account.contractAddress : account.address,
    LINEA_USDC,
  )
  return balance
}

export const getAccountNativeBalance = async (
  provider: ProviderHandler,
  account: StoreAccount,
) => {
  const balance = await provider.getBalance(
    'contractAddress' in account ? account.contractAddress : account.address,
  )
  return balance
}

export const getBalances = async (account: StoreAccount) => {
  const provider = new ProviderHandler(LINEA_NETWORK_CONFIG)
  return await Promise.all([
    getAccountUSDCBalance(provider, account),
    getAccountNativeBalance(provider, account),
  ]).then(([usdc, native]) => ({
    ...account,
    usdcBalance: usdc,
    usdcRate: testUSDCRate,
    nativeBalance: native,
    nativeRate: testNativeRate,
  }))
}
