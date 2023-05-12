import { Claim, DataStore, LocalStoreKeys, StoreAccount } from '@app/types'

export const emptyState: DataStore = {
  version: '0', // @todo: update to updatable version if necessary far in future.
  [LocalStoreKeys.ACCOUNTS]: {} as StoreAccount,
  [LocalStoreKeys.CLAIMS]: {} as Record<string, Claim>,
}

export const initialLegacyState = emptyState
