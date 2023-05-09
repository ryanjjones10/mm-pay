import { StoreAccount, TAddress } from '@app/types'
import { LINEA_TESTNET_CHAINID } from './networks'

export const testUSDCBal = '1234.5678'
export const testNativeBal = '1.01'

export const testUSDCRate = 1.0
export const testNativeRate = 1950.0
export const testAddr = '0x9c065bdc5a4a9e589Ae7DD555D66E99bb7E9ADe6'
export const testAddrWithBalance = ''

export const testAccountNew: StoreAccount = {
  address: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
  usdcBalance: testUSDCBal,
  usdcRate: testUSDCRate,
  nativeBalance: testNativeBal,
  nativeRate: testNativeRate,
}

export const testAccountWithBalancePreCheck: StoreAccount = {
  address: testAddr as TAddress,
  chainId: LINEA_TESTNET_CHAINID,
}
