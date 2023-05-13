/* eslint-disable @typescript-eslint/no-unused-vars */
import '@ethersproject/shims'
import { defaultAbiCoder } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/keccak256'
import { Wallet } from '@ethersproject/wallet'
import { ecsign } from 'ethereumjs-util'
import { TransactionResponse } from '@ethersproject/providers'
import { arrayify, hexlify, parseEther } from 'ethers/lib/utils'
import { Buffer } from 'buffer'

import {
  ClaimStruct,
  ContractStoreAccount,
  DelegatableContractTypes,
} from '@app/types'
import {
  Delegatable4337Account,
  Delegatable4337Account__factory,
  DelegatableContractsMap,
  DelegatooorFactory__factory,
  EMPTY_ADDRESS,
  EntryPoint__factory,
  LINEA_NETWORK_CONFIG,
  LINEA_USDC,
  testContactName,
} from '@app/constants'
import { ProviderHandler } from '@app/services/EthService'
import { Address, bigify } from '@app/utils'
import { importedPaymaster, mockCreatePrivateKey } from '@app/constants/account'
import {
  sendTransactionsCheck,
  shouldPrimeEntrypoint,
  shouldPrimeSmartAccount,
} from '@app/config'
import { encodeTransfer } from '../EthService'
import {
  DelegatorTypes,
  UserOpStruct,
  callData,
  create2Address,
  encoder,
  signDelegation,
} from './scripts'
import { ethers } from 'ethers'

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
): Promise<{ claim: ClaimStruct | undefined; error?: Error } | undefined> => {
  const SmartAccountFactory = new Delegatable4337Account__factory()
  new ProviderHandler(LINEA_NETWORK_CONFIG, true)
  const wallet = new Wallet(
    account.privateKey,
    ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG),
  )
  const mySmartAccount = SmartAccountFactory.connect(wallet).attach(
    account.contractAddress,
  )
  return createInvite(account, mySmartAccount, usdcAmt)
    .then((claim) => ({ claim, error: undefined }))
    .catch((e) => {
      console.error(`[inviteUser] Error creating invite: ${e}`)
      return { claim: undefined, error: e }
    })
}

export const createInvite = async (
  account: ContractStoreAccount,
  smartAccount: Delegatable4337Account,
  usdcAmt: string,
): Promise<ClaimStruct> => {
  try {
    const SmartAccountFactory = new Delegatable4337Account__factory()
    const DelegatooorFactoryFactory = new DelegatooorFactory__factory()
    const DelegatooorFactory = DelegatooorFactoryFactory.attach(
      DelegatableContractsMap[DelegatableContractTypes.DelegatooorFactory],
    )
    const EntryPointFactory = new EntryPoint__factory()
    new ProviderHandler(LINEA_NETWORK_CONFIG, true)

    const existingWallet = new Wallet(
      account.privateKey,
      ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG),
    )
    const EntryPoint = EntryPointFactory.connect(existingWallet).attach(
      DelegatableContractsMap[DelegatableContractTypes.Entrypoint],
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
    new ProviderHandler(LINEA_NETWORK_CONFIG, true)
    const newPrivateKey = mockCreatePrivateKey()
    const newWallet = new Wallet(
      newPrivateKey,
      ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG),
    )

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

    // Set up delegatable utils - FOR USED IN DELEGATING FROM SMART ACCOUNT 1 => COUNTERFACTUAL SMART ACCOUNT 2
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
    // Not needed in this iteration
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
      to: EMPTY_ADDRESS,
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
          contractAddress: EMPTY_ADDRESS,
          signature: hexsign,
        },
      ],
      delegations: [],
    }
    const provider = ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG)
    const initialBalance = await provider.getBalance(smartAccount.address)
    console.log('SmartAccount initial Balance:', initialBalance.toBigInt())
    // grab the initial balance of CFAccount Delegator for comparison later - Should be 0
    const initialBalanceCFA = await provider.getBalance(
      determinedNewSmartAccountAddress,
    )

    console.log(
      'CFAccount Delegator initial Balance:',
      initialBalanceCFA.toBigInt(),
    )

    // deposit ETH to the EntryPoint on behalf of the new CFAccount
    if (shouldPrimeEntrypoint) {
      const dTrx = await EntryPoint.depositTo(
        determinedNewSmartAccountAddress,
        {
          value: parseEther('0.25'),
        },
      )
      console.debug('dTrx sent - ', dTrx)
      await dTrx.wait(1)
    }
    console.debug(
      'got passed dTrx entrypoint depositTo determinedNewSmartAccountAddress',
    )
    // Create the CFAccount initCode UserOperation
    const userOp1 = await fillUserOp(
      {
        sender: determinedNewSmartAccountAddress,
        initCode: initCode,
        callData: await callData(
          smartAccount.address,
          intent.to,
          intent.value,
          intent.data,
          signaturePayload,
          replayProtection,
        ), // empty intent just to init new CFAccount
      },
      smartAccount as Delegatable4337Account,
    )
    console.debug('userOp1', userOp1)

    // Create the delegation UserOperation
    // Create Delegation to the new CFAccount on behalf of the SmartAccount
    const delegation = {
      delegate: determinedNewSmartAccountAddress,
      authority:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      caveats: [],
      salt: 0,
    }
    console.debug('delegation', delegation)

    const signedDelegation = await signDelegation(smartAccount)(
      eip712domain,
      DelegatorTypes.types,
    )(delegation, [existingWallet.privateKey])
    console.debug('signedDelegation', signedDelegation)

    // allows the new CFAccount to claim 1 wei from SmartAccount
    const intent2 = {
      to: determinedNewSmartAccountAddress,
      value: 1,
      data: '0x',
    }
    const replayProtection2 = {
      nonce: '0x01',
      queue: '0x00',
    }
    console.debug('intent - replayprotection2', intent, replayProtection2)

    const delHash2 = await smartAccount.getDelegatorHash(
      intent2.to,
      intent2.value,
      intent2.data,
      replayProtection2,
    )
    console.debug('delHash2', delHash2)

    const sign2 = ecsign(
      Buffer.from(arrayify(delHash2)),
      Buffer.from(arrayify(newPrivateKey)),
    )

    console.debug('sign2', sign2)

    const hexsign2 = '0x' + signatureToHexString(sign2)
    console.debug('hexsign2', hexsign2)
    const signaturePayload2 = {
      signatures: [
        {
          contractAddress: EMPTY_ADDRESS,
          signature: hexsign2,
        },
      ],
      delegations: [signedDelegation],
    }
    console.debug('signaturePayload2', signaturePayload2)
    // Create the delegation UserOperation
    const userOp2 = await fillUserOp(
      {
        sender: smartAccount.address,
        initCode: '0x',
        callData: await callData(
          smartAccount.address,
          intent2.to,
          intent2.value,
          intent2.data,
          signaturePayload2,
          replayProtection2,
        ), // sends 1 wei to new CFAccount from SmartAccount
      },
      smartAccount as Delegatable4337Account,
    )
    console.debug('userOp2', userOp2)

    return {
      contractAddress: determinedNewSmartAccountAddress,
      privateKey: newPrivateKey,
      userOps: [userOp1, userOp2],
    }
  } catch (e) {
    throw new Error(`ERROR WITH SEND '${e}'`)
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

async function fillUserOp(
  userOp: Partial<UserOpStruct>,
  sender: Delegatable4337Account,
): Promise<UserOpStruct> {
  new ProviderHandler(LINEA_NETWORK_CONFIG)
  const provider = ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG)
  if (!userOp.sender) {
    console.error('')
    return
  }
  if ((await provider.getCode(userOp.sender)) == '0x') {
    userOp.nonce = hexlify(0)
  } else {
    userOp.nonce = hexlify((await sender.getNonce()).toNumber())
  }
  userOp.callGasLimit = hexlify(300000)
  userOp.verificationGasLimit = hexlify(4700000)
  userOp.preVerificationGas = hexlify(3000000)

  const gasPrice = (await provider.getGasPrice()).mul(2)

  userOp.maxFeePerGas = hexlify(gasPrice)
  userOp.maxPriorityFeePerGas = hexlify(gasPrice)
  userOp.paymasterAndData = hexlify('0x')
  userOp.signature = hexlify('0x')
  return userOp as UserOpStruct
}

export const executeUserOps = async (
  newUserPrivateKey: string,
  determinedNewSmartAccount: string,
  userOps: UserOpStruct[],
): Promise<TransactionResponse | undefined> => {
  const EntryPointFactory = new EntryPoint__factory()
  new ProviderHandler(LINEA_NETWORK_CONFIG, true)
  const provider = ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG)
  const newUserWallet = new Wallet(newUserPrivateKey, provider)
  const EntryPoint = EntryPointFactory.connect(newUserWallet).attach(
    DelegatableContractsMap[DelegatableContractTypes.Entrypoint],
  )

  //this isn't working right, it's not being paid for by the paymaster
  const paymasterWallet = new Wallet(
    importedPaymaster,
    provider
  )

  // Execute the UserOperation which will deploy the new CFAccount and send 1 wei from the CFAccount to SmartAccount2
  return EntryPoint.handleOps(userOps, await paymasterWallet.getAddress(), {
    gasLimit: 10000000,
  })
    .then((txResponse) => txResponse)
    .catch((e) => {
      console.error(`[executeUserOps] Error executing userOps: ${e}`)
      return undefined
    })
}
