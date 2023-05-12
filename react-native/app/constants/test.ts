import {
  AccountType,
  ContractStoreAccount,
  TAddress,
  ViewOnlyStoreAccount,
} from '@app/types'
import { LINEA_TESTNET_CHAINID } from './networks'
import { b64Encode } from '@app/utils/claim'

export const testUSDCBal = '1234.5678'
export const testNativeBal = '1.01'

export const testUSDCRate = 1.0
export const testNativeRate = 1950.0
export const testAddr = '0x9c065bdc5a4a9e589Ae7DD555D66E99bb7E9ADe6'
export const testAddrWithBalance = ''

export const testUSDCAmount = '0.01'

export const testClaim = b64Encode(
  JSON.stringify({
    contractAddress: testAddr,
    privateKey:
      '0x00001111222233334444555566667777888899991010101011111111121212',
  }),
)

export const viewOnlyTestAccountNew: ViewOnlyStoreAccount = {
  address: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
  type: AccountType.VIEW_ONLY,
  usdcBalance: testUSDCBal,
  usdcRate: testUSDCRate,
  nativeBalance: testNativeBal,
  nativeRate: testNativeRate,
  transactions: [],
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
  transactions: [],
}

export const viewOnlyTestAccountPreCheck: ViewOnlyStoreAccount = {
  address: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
  type: AccountType.VIEW_ONLY,
  transactions: [],
}
