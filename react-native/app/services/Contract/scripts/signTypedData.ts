import '@ethersproject/shims'
import { Wallet, verifyTypedData } from '@ethersproject/wallet'
import ethers from 'ethers'
import { SignTypedDataVersion, hashStruct } from './signUtils'
import { Delegatable4337Account, EMPTY_ADDRESS } from '@app/constants'
import { defaultAbiCoder } from '@ethersproject/abi'

const signTypedDataLocal =
  (domain, types) =>
  async (privateKey, primaryType, message): Promise<any> => {
    const data = {
      domain,
      primaryType,
      types,
      message,
    }

    const wallet = new Wallet(privateKey)
    const signature = await wallet._signTypedData(
      data.domain,
      data.types,
      data.message,
    )
    console.debug(`[signTypedDataLocal]: signature`, signature)

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

export const signDelegation =
  (SmartAccount: Delegatable4337Account) =>
  (domain, types) =>
  async (delegation: any, privateKeys: string[]): Promise<any> => {
    console.debug(`[signDelegation]: start`)
    const sigs = await Promise.all(
      privateKeys.map((pk) =>
        signTypedDataLocal(domain, types)(pk, 'Delegation', delegation),
      ),
    )
    console.debug(`[signDelegation]: sigs`, sigs)

    const delegationSignaturePayload = sigs.map((delSig) => {
      return {
        contractAddress: EMPTY_ADDRESS,
        signature: delSig,
      }
    })
    const delegationSignaturePayloadTypes = SmartAccount.interface.getFunction(
      'decodeAgnosticSignatures',
    ).outputs

    if (!delegationSignaturePayloadTypes)
      throw new Error('No signature types found')

    const encodedDelegationSignaturePayload = defaultAbiCoder.encode(
      delegationSignaturePayloadTypes,
      [delegationSignaturePayload],
    )

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
