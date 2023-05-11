import '@ethersproject/shims'
import { verifyTypedData } from '@ethersproject/wallet'
import ethers from 'ethers'
import { SignTypedDataVersion, hashStruct } from './signUtils'

const signTypedDataLocal =
  (domain, types) => (privateKey, primaryType, message) => {
    const data = {
      domain,
      primaryType,
      types,
      message,
    }
    const wallet = new ethers.Wallet(privateKey)
    const signature = wallet._signTypedData(
      data.domain,
      data.types,
      data.message,
    )

    return signature
  }

// Define a function to verify the signature using eth-sig-util
const verifyTypedDataSignature =
  (domain, types) => (signature, message, expectedAddress) => {
    // Combine the domain and message to create the full typed data object
    const typedData = {
      domain,
      primaryType: types[0],
      types: {
        ...types[1],
        EIP712Domain: domain.types,
      },
      message,
    }

    // Verify the signature using eth-sig-util
    const signer = verifyTypedData(
      typedData.domain,
      typedData.types,
      typedData.message,
      signature,
    )

    // Compare the recovered address with the expected address
    if (signer.toLowerCase() !== expectedAddress.toLowerCase()) {
      throw new Error(
        'Invalid signature - signer address does not match expected address',
      )
    }

    return signer
  }

const hashTypedData = (domain, types) => (primaryType, message) => {
  return hashStruct(primaryType, message, types, SignTypedDataVersion.V4)
}

const createSigningUtil = (domain, types) => {
  return {
    verifyTypedDataSignature: verifyTypedDataSignature(domain, types),
    signTypedDataLocal: signTypedDataLocal(domain, types),
    hashTypedData: hashTypedData(domain, types),
  }
}

export const delegatableUtils = {
  signTypedDataLocal,
  verifyTypedDataSignature,
  createSigningUtil,
}
