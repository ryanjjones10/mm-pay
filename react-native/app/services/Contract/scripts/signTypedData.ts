import '@ethersproject/shims'
import { verifyTypedData } from '@ethersproject/wallet'
import ethers from 'ethers'
import { SignTypedDataVersion, hashStruct } from './signUtils'
import { Delegatable4337Account } from '@app/constants'

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

const signDelegation =
  (SmartAccount: Delegatable4337Account) =>
  (domain, types) =>
  (delegation: any, privateKeys: string[]): any => {
    const sigs = privateKeys.map((pk) =>
      signTypedDataLocal(domain, types)(pk, 'Delegation', delegation),
    )
    const delegationSignaturePayload = sigs.map((delSig) => {
      return {
        contractAddress: ethers.constants.AddressZero,
        signature: delSig,
      }
    })
    const delegationSignaturePayloadTypes = SmartAccount.interface.getFunction(
      'decodeAgnosticSignatures',
    ).outputs

    if (!delegationSignaturePayloadTypes)
      throw new Error('No signature types found')

    const encodedDelegationSignaturePayload =
      ethers.utils.defaultAbiCoder.encode(delegationSignaturePayloadTypes, [
        delegationSignaturePayload,
      ])

    const signedDelegation = {
      signature: encodedDelegationSignaturePayload,
      message: delegation,
      signer: SmartAccount.address,
    }
    return signedDelegation
  }

const createSigningUtil = (domain, types) => {
  return {
    verifyTypedDataSignature: verifyTypedDataSignature(domain, types),
    signTypedDataLocal: signTypedDataLocal(domain, types),
    hashTypedData: hashTypedData(domain, types),
  }
}

export const delegatableUtils = {
  signDelegation,
  signTypedDataLocal,
  verifyTypedDataSignature,
  createSigningUtil,
}
