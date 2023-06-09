/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export interface MockRelayedDelegatableInterface extends utils.Interface {
  contractName: 'MockRelayedDelegatable'
  functions: {
    'owner()': FunctionFragment
    'purpose()': FunctionFragment
    'renounceOwnership()': FunctionFragment
    'setPurpose(string)': FunctionFragment
    'transferOwnership(address)': FunctionFragment
    'trustedRelay()': FunctionFragment
  }

  encodeFunctionData(functionFragment: 'owner', values?: undefined): string
  encodeFunctionData(functionFragment: 'purpose', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'renounceOwnership',
    values?: undefined,
  ): string
  encodeFunctionData(functionFragment: 'setPurpose', values: [string]): string
  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [string],
  ): string
  encodeFunctionData(
    functionFragment: 'trustedRelay',
    values?: undefined,
  ): string

  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'purpose', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'renounceOwnership',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'setPurpose', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'trustedRelay',
    data: BytesLike,
  ): Result

  events: {
    'OwnershipTransferred(address,address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>

export interface MockRelayedDelegatable extends BaseContract {
  contractName: 'MockRelayedDelegatable'
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  interface: MockRelayedDelegatableInterface

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
    owner(overrides?: CallOverrides): Promise<[string]>

    purpose(overrides?: CallOverrides): Promise<[string]>

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    setPurpose(
      purpose_: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    trustedRelay(overrides?: CallOverrides): Promise<[string]>
  }

  owner(overrides?: CallOverrides): Promise<string>

  purpose(overrides?: CallOverrides): Promise<string>

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  setPurpose(
    purpose_: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  trustedRelay(overrides?: CallOverrides): Promise<string>

  callStatic: {
    owner(overrides?: CallOverrides): Promise<string>

    purpose(overrides?: CallOverrides): Promise<string>

    renounceOwnership(overrides?: CallOverrides): Promise<void>

    setPurpose(purpose_: string, overrides?: CallOverrides): Promise<void>

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides,
    ): Promise<void>

    trustedRelay(overrides?: CallOverrides): Promise<string>
  }

  filters: {
    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter
  }

  estimateGas: {
    owner(overrides?: CallOverrides): Promise<BigNumber>

    purpose(overrides?: CallOverrides): Promise<BigNumber>

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    setPurpose(
      purpose_: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    trustedRelay(overrides?: CallOverrides): Promise<BigNumber>
  }

  populateTransaction: {
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>

    purpose(overrides?: CallOverrides): Promise<PopulatedTransaction>

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    setPurpose(
      purpose_: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    trustedRelay(overrides?: CallOverrides): Promise<PopulatedTransaction>
  }
}
