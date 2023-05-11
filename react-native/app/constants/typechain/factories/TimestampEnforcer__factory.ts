/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  TimestampEnforcer,
  TimestampEnforcerInterface,
} from '../TimestampEnforcer'

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
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct Intent',
        name: 'transaction',
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

const _bytecode =
  '0x608060405234801561001057600080fd5b506103ec806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80635068de4c14610030575b600080fd5b61004361003e36600461021c565b610059565b60405161005091906102a4565b60405180910390f35b60008061009b86868080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920182905250925061016d915050565b905060006100e187878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506010925061016d915050565b9050816001600160801b03166000036101315742816001600160801b0316101561011057600192505050610165565b60405162461bcd60e51b8152600401610128906102f6565b60405180910390fd5b42816001600160801b0316111561014d57600192505050610165565b60405162461bcd60e51b815260040161012890610345565b949350505050565b600061017a82601061036b565b8351101561019a5760405162461bcd60e51b815260040161012890610383565b50818101601001515b92915050565b60008083601f8401126101be576101be600080fd5b5081356001600160401b038111156101d8576101d8600080fd5b6020830191508360018202830111156101f3576101f3600080fd5b9250929050565b60006060828403121561020f5761020f600080fd5b50919050565b80356101a3565b6000806000806060858703121561023557610235600080fd5b84356001600160401b0381111561024e5761024e600080fd5b61025a878288016101a9565b945094505060208501356001600160401b0381111561027b5761027b600080fd5b610287878288016101fa565b925050604061029887828801610215565b91505092959194509250565b8115158152602081016101a3565b602481526000602082017f54696d657374616d70456e666f726365723a657870697265642d64656c6567618152633a34b7b760e11b602082015291505b5060400190565b602080825281016101a3816102b2565b602281526000602082017f54696d657374616d70456e666f726365723a6561726c792d64656c656761746981526137b760f11b602082015291506102ef565b602080825281016101a381610306565b634e487b7160e01b600052601160045260246000fd5b6000821982111561037e5761037e610355565b500190565b602080825281016101a3816015815274746f55696e743132385f6f75744f66426f756e647360581b60208201526040019056fea264697066735822122053bbdaad9a5b7bb1821ec3711bbee6f761184a54bbb78bf7098ea874649c282364736f6c634300080f0033'

type TimestampEnforcerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: TimestampEnforcerConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class TimestampEnforcer__factory extends ContractFactory {
  constructor(...args: TimestampEnforcerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = 'TimestampEnforcer'
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<TimestampEnforcer> {
    return super.deploy(overrides || {}) as Promise<TimestampEnforcer>
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  attach(address: string): TimestampEnforcer {
    return super.attach(address) as TimestampEnforcer
  }
  connect(signer: Signer): TimestampEnforcer__factory {
    return super.connect(signer) as TimestampEnforcer__factory
  }
  static readonly contractName: 'TimestampEnforcer'
  public readonly contractName: 'TimestampEnforcer'
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): TimestampEnforcerInterface {
    return new utils.Interface(_abi) as TimestampEnforcerInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): TimestampEnforcer {
    return new Contract(address, _abi, signerOrProvider) as TimestampEnforcer
  }
}