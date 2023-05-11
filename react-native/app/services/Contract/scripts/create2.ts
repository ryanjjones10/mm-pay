import '@ethersproject/shims'
import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/keccak256'

export const encoder = (types, values) => {
  const abiCoder = defaultAbiCoder
  const encodedParams = abiCoder.encode(types, values)
  return encodedParams.slice(2)
}

export const create2Address = (factoryAddress, saltHex, initCode) => {
  const create2Addr = getCreate2Address(
    factoryAddress,
    saltHex,
    keccak256(initCode),
  )
  return create2Addr
}
