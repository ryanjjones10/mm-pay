import {
  AccountType,
  ContractStoreAccount,
  TAddress,
  ViewOnlyStoreAccount,
} from '@app/types'
import { LINEA_TESTNET_CHAINID } from './networks'

export const testUSDCBal = '1234.5678'
export const testNativeBal = '1.01'

export const testUSDCRate = 1.0
export const testNativeRate = 1950.0
export const testAddr = '0x9c065bdc5a4a9e589Ae7DD555D66E99bb7E9ADe6'
export const testAddrWithBalance = ''

export const viewOnlyTestAccountNew: ViewOnlyStoreAccount = {
  address: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
  type: AccountType.VIEW_ONLY,
  usdcBalance: testUSDCBal,
  usdcRate: testUSDCRate,
  nativeBalance: testNativeBal,
  nativeRate: testNativeRate,
}

export const contractTestAccountMeta: Omit<
  ContractStoreAccount,
  'privateKey' | 'address'
> = {
  contractAddress: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
  type: AccountType.CONTRACT,
  usdcBalance: '0',
  usdcRate: testUSDCRate,
  nativeBalance: '0',
  nativeRate: testNativeRate,
}

export const viewOnlyTestAccountPreCheck: ViewOnlyStoreAccount = {
  address: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
  type: AccountType.VIEW_ONLY,
}
