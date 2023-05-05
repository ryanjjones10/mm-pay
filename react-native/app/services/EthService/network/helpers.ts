import { BaseProvider, StaticJsonRpcProvider } from '@ethersproject/providers'

import { Network, NodeOptions } from '@types'
import FallbackProvider from '@vendor/fallbackProvider'

const getProvider = (node: NodeOptions, chainId: number) => {
  const { url } = node

  const connection = { url, throttleLimit: 3 }

  return new StaticJsonRpcProvider(connection, chainId)
}

export const createCustomNodeProvider = (network: Network): BaseProvider => {
  const { nodes, chainId } = network
  if (nodes.length < 1) {
    throw new Error('At least one node required!')
  }

  return getProvider(nodes[0] as any, chainId)
}

export const createFallbackNetworkProviders = (
  network: Network,
): FallbackProvider => {
  const { nodes, selectedNode, chainId } = network

  // Filter out nodes disabled by default if needed
  let sortedNodes = nodes.filter(
    (n) => !n.disableByDefault || n.name === selectedNode,
  )
  if (selectedNode && selectedNode !== '') {
    const sNode = sortedNodes.find((n) => n.name === selectedNode)
    if (sNode) {
      sortedNodes = [sNode]
    }
  }

  const providers = sortedNodes.map((n) => getProvider(n, chainId))

  return new FallbackProvider(providers)
}
