/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import { FunctionFragment, Result } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export type TransactionStruct = {
  to: string
  gasLimit: BigNumberish
  value: BigNumberish
  data: BytesLike
}

export type TransactionStructOutput = [string, BigNumber, BigNumber, string] & {
  to: string
  gasLimit: BigNumber
  value: BigNumber
  data: string
}

export interface ICaveatEnforcerInterface extends utils.Interface {
  contractName: 'ICaveatEnforcer'
  functions: {
    'enforceCaveat(bytes,(address,uint256,uint256,bytes),bytes32)': FunctionFragment
  }

  encodeFunctionData(
    functionFragment: 'enforceCaveat',
    values: [BytesLike, TransactionStruct, BytesLike],
  ): string

  decodeFunctionResult(
    functionFragment: 'enforceCaveat',
    data: BytesLike,
  ): Result

  events: {}
}

export interface ICaveatEnforcer extends BaseContract {
  contractName: 'ICaveatEnforcer'
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: ICaveatEnforcerInterface

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>

  functions: {
    enforceCaveat(
      terms: BytesLike,
      tx: TransactionStruct,
      delegationHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>
  }

  enforceCaveat(
    terms: BytesLike,
    tx: TransactionStruct,
    delegationHash: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  callStatic: {
    enforceCaveat(
      terms: BytesLike,
      tx: TransactionStruct,
      delegationHash: BytesLike,
      overrides?: CallOverrides,
    ): Promise<boolean>
  }

  filters: {}

  estimateGas: {
    enforceCaveat(
      terms: BytesLike,
      tx: TransactionStruct,
      delegationHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>
  }

  populateTransaction: {
    enforceCaveat(
      terms: BytesLike,
      tx: TransactionStruct,
      delegationHash: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>
  }
}
