import '@ethersproject/shims'
import { decode, encode } from '@ethersproject/base64'
import { toUtf8Bytes, toUtf8String } from '@ethersproject/strings'

export const b64Encode = (value: string) => {
  return encode(toUtf8Bytes(value))
}

export const b64Decode = (value: string) => {
  return toUtf8String(decode(value))
}
