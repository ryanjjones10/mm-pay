import '@ethersproject/shims'
import { hexlify } from 'ethers/lib/utils'
import { arrayify } from '@ethersproject/bytes'
import { Buffer } from 'buffer'

import { Address, TokenValue } from '@app/utils'

import { ERC20 } from './erc20'

export const encodeTransfer = (to: Address, value: TokenValue) =>
  Buffer.from(
    arrayify(ERC20.transfer.encodeInput({ _to: hexlify(to), _value: value })),
  )

export const decodeTransfer = (data: string) => ERC20.transfer.decodeInput(data)

export const decodeApproval = (data: string) => ERC20.approve.decodeInput(data)
