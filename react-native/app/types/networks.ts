import { Asset, TTicker } from './asset'
import { ExplorerConfig } from './blockExplorer'
import { GasPrice } from './gas'
import { NodeOptions } from './node'

export interface Network {
  id: string
  name: string
  baseAsset: Asset
  unit: TTicker
  chainId: number
  tokens: Asset[]
  isTestnet?: boolean
  color: string | undefined
  blockExplorer: ExplorerConfig
  gasPriceSettings: GasPrice
  shouldEstimateGasPrice?: boolean
  nodes: NodeOptions[]
  selectedNode?: string
  baseUnitName?: string
  supportsEIP1559?: boolean
}
