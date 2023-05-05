import { bufferToHex, toBuffer } from '@ethereumjs/util/dist/bytes'

import { Address, TokenValue } from '@app/utils'

import { ERC20 } from './erc20'

export const encodeTransfer = (to: Address, value: TokenValue) =>
  toBuffer(ERC20.transfer.encodeInput({ _to: bufferToHex(to), _value: value }))

export const decodeTransfer = (data: string) => ERC20.transfer.decodeInput(data)

export const decodeApproval = (data: string) => ERC20.approve.decodeInput(data)
