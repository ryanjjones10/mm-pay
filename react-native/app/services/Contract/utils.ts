import '@ethersproject/shims'
import { defaultAbiCoder } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/keccak256'
import { Wallet } from '@ethersproject/wallet'

import { create2Address, encoder } from './scripts'
import { Claim, DelegatableContractTypes } from '@app/types'
import {
  Delegatable4337Account__factory,
  DelegatableContractsMap,
  LINEA_NETWORK_CONFIG,
  LINEA_USDC,
} from '@app/constants'
import { encodeTransfer } from '../EthService'
import { ProviderHandler } from '@app/services/EthService'

import { Address, bigify } from '@app/utils'
import { mockCreatePrivateKey } from '@app/constants/account'
import { sendTransactionsCheck } from '@app/config'
import { TransactionResponse } from '@ethersproject/providers'

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
  invitation: Claim,
): Promise<TransactionResponse | undefined> => {
  // 3. user 1 sends USDC to smart contract wallet 1’s contract address (using private key 0 - user 1’s private key with eth/usdc on it.)
  const transferData = encodeTransfer(
    Address(invitation.contractAddress),
    bigify(usdcAmtToSend),
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
  existingPrivateKey: string,
  usdcAmt: string,
  network = LINEA_NETWORK_CONFIG,
): Promise<Claim | undefined> => {
  const claim = createInviteLink()
  new ProviderHandler(LINEA_NETWORK_CONFIG, true)
  const existingWallet = new Wallet(
    existingPrivateKey,
    ProviderHandler.fetchProvider(network),
  )
  return await sendUSDCToInvitationAddress(existingWallet, usdcAmt, claim)
    .then((d) => {
      console.log(`inviteUser]: txResponse: ${JSON.stringify(d, null, 2)}`)
      return claim
    })
    .catch((e) => {
      console.error(`[inviteUser] Error sending transaction: ${e}`)
      return undefined
    })
}

export const createInviteLink = (): Claim => {
  const SmartAccountFactory = new Delegatable4337Account__factory()

  //   const PurposeFactory = new Purpose__factory()
  //   const DelegatooorFactoryFactory = new DelegatooorFactory__factory()
  //   const EntryPointFactory = new EntryPoint__factory()
  //   const SimpleAccountFactory = new SimpleAccount__factory()

  // Set up delegatable utils - FOR USED IN DELEGATING FROM SMART ACCOUNT 1 => SMART ACCOUNT 2
  //   const eip712domain = {
  //     chainId: LINEA_NETWORK_CONFIG.chainId,
  //     verifyingContract: SmartAccount.address,
  //     name: CONTACT_NAME,
  //     version: '1',
  //   }

  //   delegatableUtils = createSigningUtil(eip712domain, DelegatorTypes.types)

  // 1. user 1 generates a private key 1
  //const newWallet = createRandomWallet()
  // const newPrivateKey = newWallet.privateKey
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
  console.log(
    'determinedNewSmartAccountAddress:',
    determinedNewSmartAccountAddress,
  )
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
