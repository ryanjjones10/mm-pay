import { Asset, TTicker } from '@app/types'

export const LINEA_USDC: Asset = {
  address: '0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068',
  ticker: 'USDC' as TTicker,
  name: 'USD Coin',
  type: 'erc20',
  decimal: 6,
  networkId: 'linea',
  iconUrl:
    'https://static.metaswap.codefi.network/api/v1/tokenIcons/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
}

export const LINEA_ETH: Asset = {
  address: '0x0000000000000000000000000000000000000000',
  ticker: 'ETH' as TTicker,
  name: 'Ether',
  type: 'base',
  decimal: 18,
  networkId: 'linea',
  iconUrl:
    'https://token.metaswap.codefi.network/assets/networkLogos/ethereum.svg',
}
