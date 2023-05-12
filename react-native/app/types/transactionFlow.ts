import { ComponentType } from 'react'

import { Brand } from 'utility-types'

import { Asset, Network as INetwork, ITxReceipt, TAddress } from '@app/types'
import { StoreAccount } from './account'

export type ISignedTx = string

export type ITxToAddress = TAddress
export type ITxFromAddress = TAddress
export type ITxValue = Brand<string, 'Value'> // Hex - wei
export type ITxGasLimit = Brand<string, 'GasLimit'> // Hex
export type ITxGasPrice = Brand<string, 'GasPrice'> // Hex - wei
export type ITxData = Brand<string, 'Data'> // Hex
export type ITxNonce = Brand<string, 'Nonce'> // Hex

export interface IBaseTxObject {
  readonly to?: ITxToAddress
  readonly value: ITxValue
  readonly gasLimit: ITxGasLimit
  readonly data: ITxData
  readonly nonce: ITxNonce
  readonly chainId: number
  readonly from?: ITxFromAddress
}

export interface ILegacyTxObject extends IBaseTxObject {
  readonly gasPrice: ITxGasPrice
  readonly type?: 0
}

// @todo Rename?
export interface ITxType2Object extends IBaseTxObject {
  readonly maxFeePerGas: ITxGasPrice
  readonly maxPriorityFeePerGas: ITxGasPrice
  readonly type: 2
}

export type ITxObject = ILegacyTxObject | ITxType2Object

export interface ITxConfig {
  readonly rawTransaction: ITxObject /* The rawTransaction object that will be signed */
  readonly amount: string
  readonly receiverAddress?: TAddress // Recipient of the send. NOT always the tx's `to` address
  readonly senderAccount: StoreAccount
  readonly from: TAddress
  readonly asset: Asset
  readonly baseAsset: Asset
  readonly networkId: string
}

export interface IFormikFields {
  asset: Asset
  address: IReceiverAddress
  amount: string
  account: StoreAccount
  txDataField: string
  gasPriceField: string
  gasPriceSlider: string
  gasLimitField: string
  nonceField: string // Use only if user has input a manual nonce value.
  network: INetwork
  advancedTransaction: boolean
  isAutoGasSet: boolean
  maxFeePerGasField: string
  maxPriorityFeePerGasField: string
}

export interface ISignComponentProps {
  network: INetwork
  senderAccount: StoreAccount
  rawTransaction: ITxObject
  children?: never
  onSuccess(receipt: ITxReceipt | ISignedTx): void
}

export interface IDefaultStepComponentProps {
  completeButtonText?: string
  resetFlow(): void
  onComplete(payload?: IFormikFields | ITxReceipt | ISignedTx | null): void
}

export interface IStepComponentProps extends IDefaultStepComponentProps {
  txConfig: ITxConfig
  txReceipt?: ITxReceipt
  signedTx?: string
  txType?: ITxType
  txQueryType?: TxQueryTypes
  error?: string
  children?: never
}

export interface ITxReceiptStepProps {
  txConfig: ITxConfig
  txReceipt?: ITxReceipt
  signedTx?: string
  txQueryType?: TxQueryTypes
  disablePendingState?: boolean
  children?: never
  completeButton?: string | (() => JSX.Element)
  onComplete(data: IFormikFields | ITxReceipt | ISignedTx | null): void
  resetFlow(): void
  setLabel?(label: string): void
}

export interface IReceiverAddress {
  display: string
  value: string
}

export type SigningComponents = {
  local: ComponentType<ISignComponentProps> | null
}

export type ITxHistoryStatus =
  | ITxStatus.PENDING
  | ITxStatus.SUCCESS
  | ITxStatus.FAILED
  | ITxStatus.UNKNOWN

export enum ITxStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  AWAITING_CLAIM = 'AWAITING_CLAIM',
  CLAIMED = 'CLAIMED',
  UNKNOWN = 'UNKNOWN',
}

export enum ITxType {
  UNKNOWN = 'UNKNOWN',
  STANDARD = 'STANDARD',
  DEPLOY_SMART_ACCOUNT = 'DEPLOY_SMART_ACCOUNT',
  REVOKE_CLAIM = 'REVOKE_CLAIM',
  CREATED_CLAIM = 'CREATED_CLAIM',
  DO_CLAIM = 'DO_CLAIM',
}

export interface ITxTypeMeta {
  type: string
  protocol?: string
}

export type TxType = Brand<string, 'TxType'>

export interface ISimpleTxForm {
  address: string // simple eth address
  amount: string // in ether - ex: 1
  gasLimit: string | number // number - ex: 1,500,000
  gasPrice: string // gwei
  maxFeePerGas: string // gwei
  maxPriorityFeePerGas: string // gwei
  nonce: string // number - ex: 55
  account: StoreAccount
}

export interface ISimpleTxFormFull extends ISimpleTxForm {
  asset: Asset
  network: INetwork
}

export type TStepAction = (payload: any, after: () => void) => void

export enum TxQueryTypes {
  SPEEDUP = 'speedup',
  CANCEL = 'cancel',
  DEFAULT = 'default',
}
