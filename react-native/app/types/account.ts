import { TAddress } from './address'

export interface StoreAccount {
  address: TAddress
  chainId: number
  privateKey?: string
  usdcBalance?: string
  usdcRate?: number
  nativeBalance?: string
  nativeRate?: number
}
