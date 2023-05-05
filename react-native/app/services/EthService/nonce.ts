import { Network, TAddress } from '@app/types'

import { ProviderHandler } from './network'

export function getNonce(network: Network, address: TAddress) {
  const provider = new ProviderHandler(network)
  return provider.getTransactionCount(address)
}
