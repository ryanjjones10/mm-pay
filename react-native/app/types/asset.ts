import { BigNumber } from '@ethersproject/bignumber'
import { Brand } from 'utility-types'

import { TAddress, TUuid } from '@app/types'

export type TTicker = Brand<string, 'Ticker'>
export type TFiatTicker = Brand<TTicker, 'FiatTicker'>
export type TCurrencySymbol = Brand<string, 'Symbol'>
export type TAssetType = 'base' | 'erc20' | 'fiat'
export type ISwapAsset = Pick<Asset, 'name' | 'ticker' | 'decimal' | 'address'>

export interface Fiat {
  name: string
  ticker: TFiatTicker
  symbol: TCurrencySymbol
  prefix?: boolean
}

export interface IProvidersMappings {
  readonly coinGeckoId?: string
  readonly cryptoCompareId?: string
  readonly coinCapId?: string
}

export interface Asset {
  readonly name: string
  readonly networkId: string
  readonly ticker: TTicker // The 3 letter curency code to identify an asset.
  readonly type: TAssetType
  readonly address: TAddress | string
  readonly decimal: number
  readonly iconUrl: string
}

export interface ExtendedAsset extends Asset {
  website?: string
  whitepaper?: string
  mappings?: IProvidersMappings
}

export interface ReserveAsset extends Asset {
  reserveExchangeRate: string // Is a BigNumberJS float string
}

// Used to reference an Asset in a storage Account
export interface AssetBalanceObject {
  readonly uuid: TUuid
  balance: BigNumber | string
}

export type StoreAsset = ExtendedAsset & {
  balance: BigNumber
  rate?: number
}
