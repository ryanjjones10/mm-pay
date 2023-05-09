export enum LocalStoreKeys {
  ACCOUNTS = 'accounts',
}

export interface DataStore {
  readonly version: string
  readonly [LocalStoreKeys.ACCOUNTS]: any
}
