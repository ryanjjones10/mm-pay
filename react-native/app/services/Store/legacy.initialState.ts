import { DataStore, LocalStoreKeys } from '@app/types'

export const emptyState: DataStore = {
  version: '0', // @todo: update to updatable version if necessary far in future.
  [LocalStoreKeys.ACCOUNTS]: {},
}

export const initialLegacyState = emptyState
