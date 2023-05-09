import { TAddress } from './address'

export interface StoreAccount {
  address: TAddress
  usdcBalance?: string
  usdcRate?: number
  nativeBalance?: string
  nativeRate?: number
  chainId: number
}
