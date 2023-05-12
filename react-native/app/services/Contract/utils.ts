/* eslint-disable @typescript-eslint/no-unused-vars */
import '@ethersproject/shims'
import { defaultAbiCoder } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/keccak256'
import { Wallet } from '@ethersproject/wallet'
import { ecsign } from 'ethereumjs-util'
import { TransactionResponse } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { arrayify } from 'ethers/lib/utils'

import {
  ClaimObject,
  ContractStoreAccount,
  DelegatableContractTypes,
} from '@app/types'
import {
  Delegatable4337Account,
  Delegatable4337Account__factory,
  DelegatableContractsMap,
  DelegatooorFactory__factory,
  LINEA_NETWORK_CONFIG,
  LINEA_USDC,
  testContactName,
} from '@app/constants'
import { ProviderHandler } from '@app/services/EthService'
import { Address, bigify } from '@app/utils'
import { mockCreatePrivateKey } from '@app/constants/account'
import { sendTransactionsCheck, shouldPrimeSmartAccount } from '@app/config'
import { encodeTransfer } from '../EthService'
import { create2Address, encoder } from './scripts'

function signatureToHexString(signature: any) {
  const rHex = signature.r.toString('hex')
  const sHex = signature.s.toString('hex')
  const vHex = signature.v.toString(16).padStart(2, '0') // Convert bigint to hexadecimal and pad with leading zero if necessary
  return rHex + sHex + vHex
}

export const generateSmartAccountByteCode = (
  smartAccountFactoryBytecode: string,
  newUsersSigner: Wallet,
  entrypointAddress: string,
  threshold = 1,
) => {
  return (
    smartAccountFactoryBytecode +
    encoder(
      ['address', 'address[]', 'uint8'],
      [entrypointAddress, [newUsersSigner.address], threshold],
    )
  )
}

export const sendUSDCToInvitationAddress = async (
  inviteOriginator: Wallet,
  usdcAmtToSend: string,
  toAddress: string,
): Promise<TransactionResponse | undefined> => {
  // 3. user 1 sends USDC to smart contract wallet 1’s contract address (using private key 0 - user 1’s private key with eth/usdc on it.)
  const transferData = encodeTransfer(
    Address(toAddress),
    bigify(usdcAmtToSend), // i've only tested this with integers. may need some working for decimals.
  )
  const txToSend = {
    value: '0x0',
    data: transferData,
    to: LINEA_USDC.address,
  }
  console.debug(txToSend)
  if (sendTransactionsCheck) {
    return await inviteOriginator
      .sendTransaction(txToSend)
      .then((txResponse) => txResponse)
      .catch((e) => {
        console.error(
          `[sendUSDCToInvitationAddress] Error sending transaction: ${e}`,
        )
        return undefined
      })
  }
  // sending transactions is turned off for now.
  return undefined
}

export const inviteUser = async (
  account: ContractStoreAccount,
  usdcAmt: string,
): Promise<ClaimObject | undefined> => {
  const SmartAccountFactory = new Delegatable4337Account__factory()
  const mySmartAccount = SmartAccountFactory.attach(account.contractAddress)
  const claim = createInviteLink(account, mySmartAccount, usdcAmt)

  return claim
}

export const createInviteLink = async (
  account: ContractStoreAccount,
  smartAccount: Delegatable4337Account,
  usdcAmt: string,
): Promise<ClaimObject> => {
  const SmartAccountFactory = new Delegatable4337Account__factory()
  const DelegatooorFactoryFactory = new DelegatooorFactory__factory()
  const DelegatooorFactory = DelegatooorFactoryFactory.attach(
    DelegatableContractsMap[DelegatableContractTypes.DelegatooorFactory],
  )
  new ProviderHandler(LINEA_NETWORK_CONFIG, true)

  const existingWallet = new Wallet(
    account.privateKey,
    ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG),
  )

  if (shouldPrimeSmartAccount) {
    const txResponse = await existingWallet.sendTransaction({
      to: smartAccount.address,
      value: ethers.utils.parseEther('1'),
    })
    console.debug('priming tx: ', txResponse)
  }
  //   delegatableUtils = createSigningUtil(eip712domain, DelegatorTypes.types)

  // 1. user 1 generates a private key 1
  const newPrivateKey = mockCreatePrivateKey()
  const newWallet = new Wallet(newPrivateKey)

  // 2. user 1 simulates deploy of smart contract wallet 1
  // using private key 1 as the owner with a threshold of 1
  // to get **create2** address (now called “smart contract
  // wallet 1’s contract address”)

  // does SmartAccountFactory.bytecode require pre-deployment of this contract?
  const completeBytecode = generateSmartAccountByteCode(
    SmartAccountFactory.bytecode,
    newWallet,
    newWallet.address,
  )
  // @todo: what is the [123] for?
  const salt = keccak256(defaultAbiCoder.encode(['uint256'], [123]))
  console.log('salt:', salt)
  // this is the determined new smart contract address using the newWallet as the signer.
  const determinedNewSmartAccountAddress = create2Address(
    DelegatableContractsMap[DelegatableContractTypes.DelegatooorFactory],
    salt,
    completeBytecode,
  )
  //   const PurposeFactory = new Purpose__factory()
  //   const DelegatooorFactoryFactory = new DelegatooorFactory__factory()
  //   const EntryPointFactory = new EntryPoint__factory()
  //   const SimpleAccountFactory = new SimpleAccount__factory()

  // Set up delegatable utils - FOR USED IN DELEGATING FROM SMART ACCOUNT 1 => SMART ACCOUNT 2
  const eip712domain = {
    chainId: LINEA_NETWORK_CONFIG.chainId,
    verifyingContract: smartAccount.address,
    name: testContactName,
    version: '1',
  }

  console.log(
    'determinedNewSmartAccountAddress:',
    determinedNewSmartAccountAddress,
  )
  let sentUSDC = true
  if (sendTransactionsCheck) {
    sentUSDC = await sendUSDCToInvitationAddress(
      existingWallet,
      usdcAmt,
      determinedNewSmartAccountAddress,
    )
      .then((d) => {
        console.log(
          `[sendUSDCToInvitationAddress]: txResponse: ${JSON.stringify(
            d,
            null,
            2,
          )}`,
        )
        return true
      })
      .catch((e) => {
        console.error(
          `[sendUSDCToInvitationAddress] Error sending transaction: ${e}`,
        )
        return false
      })
  }

  // get initcode from delegatooor factory deploy function
  const initCode =
    DelegatooorFactory.address +
    DelegatooorFactory.interface
      .encodeFunctionData('deploy', [completeBytecode, salt])
      .slice(2)
  console.log('initCode:', initCode)
  // The new CFAccount pays someone else ie SmartAccount2
  // The new CFAccount has an empty intent
  const intent = {
    to: ethers.constants.AddressZero,
    value: 0,
    data: '0x',
  }
  const replayProtection = {
    nonce: '0x01',
    queue: '0x00',
  }
  // get the hash that sig will be validated against
  const delHash = await smartAccount.getDelegatorHash(
    intent.to,
    intent.value,
    intent.data,
    replayProtection,
  )
  console.log('delHash:', delHash)

  // sign the hash with the new signer - since new signer will be the owner of the new CFAccount
  const sign = ecsign(
    Buffer.from(arrayify(delHash)),
    Buffer.from(arrayify(newPrivateKey)),
  )
  const hexsign = '0x' + signatureToHexString(sign)

  const signaturePayload = {
    signatures: [
      {
        contractAddress: ethers.constants.AddressZero,
        signature: hexsign,
      },
    ],
    delegations: [],
  }

  return {
    contractAddress: determinedNewSmartAccountAddress,
    privateKey: newPrivateKey,
  }
  //   const initCode =
  //     DelegatableContractsMap[DelegatableContractTypes.DelegatooorFactory] +
  //     DelegatooorFactoryFactory.interface
  //       .encodeFunctionData('deploy', [completeBytecode, salt])
  //       .slice(2)

  // 4. user 1 generates link containing private key 1 & smart contract wallet 1’s contract address to user 2.

  // ~~ UTILS FOR SMART CONTRACT ACC 1=> SMART CONTRACT ACC 2
  // Create the delegation (@todo: what is the delegation for in this instance?)
  // In the example, this contract is deployed by private key 0 for private key 1 (newPrivateKey).
  // I _think_ SmartAccount2.address the determinedNewSmartAccountAddress
  // @todo: what is the authority being set to empty address for?
  /*const delegation = {
    delegate: determinedNewSmartAccountAddress,
    authority:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    caveats: [],
    salt: 0,
  }
  const delSig = delegatableUtils.signTypedDataLocal(
    DelegatorTypes.domain,
    DelegatorTypes.types,
  )(newPrivateKey, 'Delegation', delegation)
  const delegationSignaturePayload = [
    {
      contractAddress: EMPTY_ADDRESS,
      signature: delSig,
    },
  ]
  // delegation from smart contract user 1.
     const delegationSignaturePayloadTypes = SmartAccount.interface.getFunction(
//     'decodeAgnosticSignatures',
//   ).outputs
//   if (!delegationSignaturePayloadTypes)
//     throw new Error('No signature types found')

//   const encodedDelegationSignaturePayload = defaultAbiCoder.encode(
//     delegationSignaturePayloadTypes,
//     [delegationSignaturePayload],
//   )

//   const signedDelegation = {
//     signature: encodedDelegationSignaturePayload,
//     message: delegation,
//     signer: determinedNewSmartAccountAddress,
//   } */
}
