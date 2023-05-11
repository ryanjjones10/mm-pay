/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'

import { Contract, Signer, utils } from 'ethers'
import { Provider } from '@ethersproject/providers'
import type {
  ICaveatEnforcer,
  ICaveatEnforcerInterface,
} from '../ICaveatEnforcer'

const _abi = [
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'terms',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'gasLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct Transaction',
        name: 'tx',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'delegationHash',
        type: 'bytes32',
      },
    ],
    name: 'enforceCaveat',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export class ICaveatEnforcer__factory {
  static readonly abi = _abi
  static createInterface(): ICaveatEnforcerInterface {
    return new utils.Interface(_abi) as ICaveatEnforcerInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): ICaveatEnforcer {
    return new Contract(address, _abi, signerOrProvider) as ICaveatEnforcer
  }
}