import { Overwrite } from 'utility-types'

import { TAddress } from './address'
import { AssetBalanceObject, StoreAsset } from './asset'
import { Network } from './networks'
import { ITxReceipt } from './transaction'
import { TUuid } from './uuid'

export interface IAccount {
  uuid: TUuid
  label?: string
  address: TAddress
  networkId: string
  assets: AssetBalanceObject[]
  wallet: 'local'
  transactions: ITxReceipt[]
  mtime: number
  favorite: boolean
}

export type StoreAccount = Overwrite<
  IAccount,
  {
    assets: StoreAsset[]
  }
> & {
  network: Network
  label: string
}
