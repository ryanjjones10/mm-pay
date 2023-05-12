import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumberish, Signer, Wallet, utils, constants } from 'ethers'

import { arrayify, defaultAbiCoder, hexlify, keccak256 } from 'ethers/lib/utils'
import { ecsign } from 'ethereumjs-util'

import { pimlicoAPIKey } from '@app/constants/account'

import { ContractConfig } from './config'
import {
  Delegatable4337Account__factory,
  EntryPoint__factory,
  LINEA_NETWORK_CONFIG,
} from '@app/constants'
import { ProviderHandler } from '@app/services/EthService'
import {
  Delegatable4337Account,
  ReplayProtectionStruct,
  SignaturePayloadStruct,
} from '@app/constants/typechain/Delegatable4337Account'

const lineaTestnetName = 'linea-testnet'

function getBundlerUrl(network: string): string | undefined {
  if (!pimlicoAPIKey || pimlicoAPIKey === '') return undefined
  return `https://api.pimlico.io/v1/${network}/rpc?apikey=${pimlicoAPIKey}`
}

export interface UserOpStruct {
  sender: string
  nonce: BigNumberish
  initCode: string
  callData: string
  callGasLimit: BigNumberish
  verificationGasLimit: BigNumberish
  preVerificationGas: BigNumberish
  maxFeePerGas: BigNumberish
  maxPriorityFeePerGas: BigNumberish
  paymasterAndData: string
  signature: string
}

export async function sendUserOperation(userOp: UserOpStruct): Promise<string> {
  const bundlerProvider = new JsonRpcProvider(getBundlerUrl(lineaTestnetName))
  const receipt = await bundlerProvider.send('eth_sendUserOperation', [
    userOp,
    ContractConfig[lineaTestnetName].entrypoint,
  ])
  return receipt
}

export async function estimateUserOperationGas(userOp: UserOpStruct) {
  const bundlerProvider = new JsonRpcProvider(getBundlerUrl(lineaTestnetName))
  const { preVerificationGas, verificationGas, callGasLimit } =
    await bundlerProvider.send('eth_estimateUserOperationGas', [
      userOp,
      ContractConfig[lineaTestnetName].entrypoint,
    ])

  return { preVerificationGas, verificationGas, callGasLimit }
}

export async function getUserOperationReceipt(
  userOpHash: string,
): Promise<any> {
  const bundlerProvider = new JsonRpcProvider(getBundlerUrl(lineaTestnetName))
  const receipt = await bundlerProvider.send('eth_getUserOperationReceipt', [
    userOpHash,
  ])
  return receipt
}

function signatureToHexString(signature: any) {
  const rHex = signature.r.toString('hex')
  const sHex = signature.s.toString('hex')
  const vHex = signature.v.toString(16).padStart(2, '0') // Convert bigint to hexadecimal and pad with leading zero if necessary
  return rHex + sHex + vHex
}

export async function signUserOp(
  userOp: UserOpStruct,
  wallet: Wallet,
): Promise<string> {
  new ProviderHandler(LINEA_NETWORK_CONFIG)
  const entryPointFactory = new EntryPoint__factory()
  const entryPoint = entryPointFactory.attach(
    ContractConfig[lineaTestnetName].entrypoint,
  )
  // const signature = await signer.signMessage(arrayify(await entryPoint.getUserOpHash(userOp)))
  // return signature

  const hash = await entryPoint.getUserOpHash(userOp)
  const sign = ecsign(
    Buffer.from(arrayify(hash)),
    Buffer.from(arrayify(wallet.privateKey)),
  )

  const hexsign = '0x' + signatureToHexString(sign)

  const signaturePayload = {
    signatures: [
      {
        contractAddress: constants.AddressZero,
        signature: hexsign,
      },
    ],
    delegations: [],
  }
  const sigTypesString = `[{"name":"payload","type":"tuple","indexed":null,"components":[{"name":"delegations","type":"tuple[]","indexed":null,"components":[{"name":"message","type":"tuple","indexed":null,"components":[{"name":"delegate","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"authority","type":"bytes32","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes32","_isParamType":true},{"name":"caveats","type":"tuple[]","indexed":null,"components":[{"name":"enforcer","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"terms","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true}],"arrayLength":-1,"arrayChildren":{"name":null,"type":"tuple","indexed":null,"components":[{"name":"enforcer","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"terms","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true},"baseType":"array","_isParamType":true},{"name":"gasLimit","type":"uint256","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"uint256","_isParamType":true},{"name":"nonce","type":"uint256","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"uint256","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true},{"name":"signature","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true},{"name":"signer","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true}],"arrayLength":-1,"arrayChildren":{"name":null,"type":"tuple","indexed":null,"components":[{"name":"message","type":"tuple","indexed":null,"components":[{"name":"delegate","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"authority","type":"bytes32","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes32","_isParamType":true},{"name":"caveats","type":"tuple[]","indexed":null,"components":[{"name":"enforcer","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"terms","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true}],"arrayLength":-1,"arrayChildren":{"name":null,"type":"tuple","indexed":null,"components":[{"name":"enforcer","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true},{"name":"terms","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true},"baseType":"array","_isParamType":true},{"name":"gasLimit","type":"uint256","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"uint256","_isParamType":true},{"name":"nonce","type":"uint256","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"uint256","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true},{"name":"signature","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true},{"name":"signer","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true},"baseType":"array","_isParamType":true},{"name":"signatures","type":"tuple[]","indexed":null,"components":[{"name":"signature","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true},{"name":"contractAddress","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true}],"arrayLength":-1,"arrayChildren":{"name":null,"type":"tuple","indexed":null,"components":[{"name":"signature","type":"bytes","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"bytes","_isParamType":true},{"name":"contractAddress","type":"address","indexed":null,"components":null,"arrayLength":null,"arrayChildren":null,"baseType":"address","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true},"baseType":"array","_isParamType":true}],"arrayLength":null,"arrayChildren":null,"baseType":"tuple","_isParamType":true}]`
  const signaturePayloadTypes = JSON.parse(sigTypesString)
  if (!signaturePayloadTypes) throw new Error('No signature types found')

  const encodedSignaturePayload = utils.defaultAbiCoder.encode(
    signaturePayloadTypes,
    [signaturePayload],
  )

  return encodedSignaturePayload
}

export async function buildSignaturePayload(
  smartAccount: Delegatable4337Account,
  wallet: Wallet,
  //delegation?: DelegationStruct,
): Promise<SignaturePayloadStruct> {
  // const eip712domain = {
  //     chainId: smartAccount.deployTransaction.chainId,
  //     verifyingContract: smartAccount.address,
  //     name: "Smart Account",
  //     version: "1",
  // }

  // const delegatableUtils = createSigningUtil(eip712domain, types.types)
  // // TODO: use real delegation
  // const delSig = delegatableUtils.signTypedDataLocal(wallet.privateKey, "Delegation", {})

  // const delegationSignaturePayload = [
  //     {
  //         contractAddress: constants.AddressZero,
  //         signature: delSig,
  //     },
  // ];
  // const delegationSignaturePayloadTypes = smartAccount.interface.getFunction("decodeAgnosticSignatures").outputs
  // if (!delegationSignaturePayloadTypes) throw new Error("No signature types found")

  // const encodedDelegationSignaturePayload = utils.defaultAbiCoder.encode(
  //     delegationSignaturePayloadTypes,
  //     [delegationSignaturePayload]
  // )

  // const signedDelegation = {
  //   signature: encodedDelegationSignaturePayload,
  //   message: delegation,
  //   signer: smartAccount.address,
  // }

  const delHash = await smartAccount.getSigneddelegationArrayPacketHash([])

  console.log('delHash:', delHash)
  //const hash = await entryPoint.getUserOpHash(userOp)
  const sign = ecsign(
    Buffer.from(arrayify(delHash)),
    Buffer.from(arrayify(wallet.privateKey)),
  )
  const hexsign = '0x' + signatureToHexString(sign)

  const signaturePayload = {
    signatures: [
      {
        contractAddress: constants.AddressZero,
        signature: hexsign,
      },
    ],
    delegations: [],
  }
  return signaturePayload
}

export async function callData(
  accountAddress: string,
  to: string,
  value: BigNumberish,
  data: string,
  signaturePayload: SignaturePayloadStruct,
  replayProtection: ReplayProtectionStruct,
): Promise<string> {
  new ProviderHandler(LINEA_NETWORK_CONFIG)
  const provider = ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG)
  const account = Delegatable4337Account__factory.connect(
    accountAddress,
    provider,
  )
  return account.interface.encodeFunctionData('execute', [
    to,
    value,
    data,
    signaturePayload,
    replayProtection,
  ])
}

export async function fillUserOp(
  existingWallet: Wallet,
  userOp: Partial<UserOpStruct>,
): Promise<UserOpStruct> {
  new ProviderHandler(LINEA_NETWORK_CONFIG)
  const provider = ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG)
  if (!userOp.sender) {
    console.error('[fillUserOp]: No userOp.sender when it is expected')
  }
  const sender = Delegatable4337Account__factory.connect(
    userOp.sender,
    existingWallet,
  )
  if ((await provider.getCode(userOp.sender)) === '0x') {
    userOp.nonce = hexlify(0)
  } else {
    userOp.nonce = hexlify((await sender.getNonce()).toNumber())
  }
  userOp.callGasLimit = hexlify(3000000)
  userOp.verificationGasLimit = hexlify(3000000)
  userOp.preVerificationGas = hexlify(3000000)

  const gasPrice = (await provider.getGasPrice()).mul(2)

  userOp.maxFeePerGas = hexlify(gasPrice)
  userOp.maxPriorityFeePerGas = hexlify(gasPrice)
  userOp.paymasterAndData = hexlify('0x')
  userOp.signature = hexlify('0x')
  return userOp as UserOpStruct
}

export async function signUserOpWithPaymaster(
  userOp: UserOpStruct,
): Promise<string> {
  const bundlerProvider = new JsonRpcProvider(getBundlerUrl(lineaTestnetName))
  const signature = await bundlerProvider.send('pm_sponsorUserOperation', [
    userOp,
    {
      entryPoint: ContractConfig[lineaTestnetName].entrypoint,
    },
  ])
  return signature.paymasterAndData
}

export async function deployAccount(
  owner: string,
  signer: Signer,
): Promise<Delegatable4337Account> {
  const account = await new Delegatable4337Account__factory(signer).deploy(
    ContractConfig[lineaTestnetName].entrypoint,
    [owner],
    1,
  )
  return account
}

export function getUserOpHash(
  op: UserOpStruct,
  entryPoint: string,
  chainId: number,
): string {
  const hashedUserOp = {
    sender: op.sender,
    nonce: op.nonce,
    initCodeHash: keccak256(op.initCode),
    callDataHash: keccak256(op.callData),
    callGasLimit: op.callGasLimit,
    verificationGasLimit: op.verificationGasLimit,
    preVerificationGas: op.preVerificationGas,
    maxFeePerGas: op.maxFeePerGas,
    maxPriorityFeePerGas: op.maxPriorityFeePerGas,
    paymasterAndDataHash: keccak256(op.paymasterAndData),
  }

  const userOpType = {
    components: [
      { type: 'address', name: 'sender' },
      { type: 'uint256', name: 'nonce' },
      { type: 'bytes32', name: 'initCodeHash' },
      { type: 'bytes32', name: 'callDataHash' },
      { type: 'uint256', name: 'callGasLimit' },
      { type: 'uint256', name: 'verificationGasLimit' },
      { type: 'uint256', name: 'preVerificationGas' },
      { type: 'uint256', name: 'maxFeePerGas' },
      { type: 'uint256', name: 'maxPriorityFeePerGas' },
      { type: 'bytes32', name: 'paymasterAndDataHash' },
    ],
    name: 'hashedUserOp',
    type: 'tuple',
  }
  const encoded = defaultAbiCoder.encode(
    [userOpType as any],
    [{ ...hashedUserOp }],
  )
  // remove leading word (total length) and trailing word (zero-length signature)

  const userOpHash = keccak256(encoded)
  const enc = defaultAbiCoder.encode(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPoint, chainId],
  )
  return keccak256(enc)
}
