import '@ethersproject/shims'
import { keccak256 } from '@ethersproject/keccak256'
import { isHexString } from '@ethersproject/bytes'
import { id } from '@ethersproject/hash'

export const buildCreate2Address = (
  sender: string,
  saltHex: string,
  byteCode: string,
) => {
  return `0x${keccak256(
    `0x${['ff', sender, saltHex, keccak256(byteCode)]
      .map((x) => x.replace(/0x/, ''))
      .join('')}`,
  ).slice(-40)}`.toLowerCase()
}

export const saltToHex = (salt: string | number) => {
  salt = salt.toString()
  if (isHexString(salt)) {
    return salt
  }

  return id(salt)
}
