import { TAddress } from './address'
import { ExtendedTxResponse } from './transaction'

export enum AccountType {
  EOA = 'eoa',
  CONTRACT = 'contract',
  VIEW_ONLY = 'view_only',
}
export interface BaseStoreAccount {
  // display address (is signer's address when privateKey
  // is present, if no privateKey - it's a view_only account)
  address: TAddress
  chainId: number
  transactions: Record<string, ExtendedTxResponse>

  usdcBalance?: string
  usdcRate?: number
  nativeBalance?: string
  nativeRate?: number
}

export interface ContractStoreAccount extends BaseStoreAccount {
  privateKey: string // signer address
  contractAddress: string // contract wallet's address
  type: AccountType.CONTRACT
}

export interface EOAStoreAccount extends BaseStoreAccount {
  privateKey: string // signer address
  type: AccountType.EOA
}

export interface ViewOnlyStoreAccount extends BaseStoreAccount {
  type: AccountType.VIEW_ONLY
}

export type StoreAccount =
  | ViewOnlyStoreAccount
  | EOAStoreAccount
  | ContractStoreAccount
