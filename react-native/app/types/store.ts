import { StoreAccount } from './account'
import { Claim } from './claim'

export enum LocalStoreKeys {
  ACCOUNTS = 'accounts',
  CLAIMS = 'claims',
}

export interface DataStore {
  readonly version: string
  readonly [LocalStoreKeys.ACCOUNTS]: StoreAccount
  readonly [LocalStoreKeys.CLAIMS]: Record<string, Claim>
}
