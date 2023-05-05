import { ExplorerConfig, TAddress } from '@types'

/**
 * Create config object for each network.
 * Allow overrides when necessary.
 */
export function makeExplorer(config: ExplorerConfig): ExplorerConfig {
  return {
    txPath: 'tx',
    tokenPath: 'token',
    addressPath: 'address',
    blockPath: 'block',
    // Custom values
    ...config,
  }
}
export const buildTxUrl = (config: ExplorerConfig, hash: string) =>
  `${config.origin}/${config.txPath}/${hash}`
export const buildAddressUrl = (config: ExplorerConfig, address: TAddress) =>
  `${config.origin}/${config.addressPath}/${address}`
export const buildBlockUrl = (config: ExplorerConfig, blockNum: number) =>
  `${config.origin}/${config.blockPath}/${blockNum}`
export const buildTokenUrl = (
  config: ExplorerConfig,
  contractAddress: TAddress,
) => `${config.origin}/${config.tokenPath}/${contractAddress}`
