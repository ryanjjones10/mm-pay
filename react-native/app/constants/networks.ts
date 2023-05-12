import { GAS_PRICE_DEFAULT } from '@app/config'
import { Network, NodeType, TTicker } from '@app/types'
import { makeExplorer } from '@app/utils/makeParams'
import { LINEA_ETH, LINEA_USDC } from './assets'

export const LINEA_TESTNET_CHAINID = 59140

export const LINEA_NETWORK_CONFIG: Network = {
  id: 'linea',
  name: 'Linea',
  baseUnitName: 'Ether',
  baseAsset: LINEA_ETH,
  unit: 'ETH' as TTicker,
  chainId: LINEA_TESTNET_CHAINID,
  isTestnet: true,
  color: '#007896',
  blockExplorer: makeExplorer({
    name: 'Linea (goerli) Explorer',
    origin: 'https://explorer.goerli.linea.build/',
  }),
  nodes: [
    {
      isCustom: false,
      name: 'Linea Build',
      type: NodeType.RPC,
      service: 'Linea Build',
      url: 'https://rpc.goerli.linea.build/',
      hidden: false,
      disableByDefault: false,
    },
  ],
  tokens: [LINEA_USDC],
  gasPriceSettings: GAS_PRICE_DEFAULT,
  shouldEstimateGasPrice: true,
  supportsEIP1559: true,
}
