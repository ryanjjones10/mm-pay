/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  EIP1271Enforcer,
  EIP1271EnforcerInterface,
} from '../EIP1271Enforcer'

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
  '0x608060405234801561001057600080fd5b5061019f806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80635068de4c14610030575b600080fd5b61004861003e3660046100d3565b6001949350505050565b604051610055919061015b565b60405180910390f35b60008083601f84011261007357610073600080fd5b5081356001600160401b0381111561008d5761008d600080fd5b6020830191508360018202830111156100a8576100a8600080fd5b9250929050565b6000606082840312156100c4576100c4600080fd5b50919050565b80355b92915050565b600080600080606085870312156100ec576100ec600080fd5b84356001600160401b0381111561010557610105600080fd5b6101118782880161005e565b945094505060208501356001600160401b0381111561013257610132600080fd5b61013e878288016100af565b925050604061014f878288016100ca565b91505092959194509250565b8115158152602081016100cd56fea2646970667358221220d7643d67b4471d0e0496ad3fffd5322e437c64594726bc6e7f9e20ea5dbe2ad164736f6c634300080f0033'

type EIP1271EnforcerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: EIP1271EnforcerConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class EIP1271Enforcer__factory extends ContractFactory {
  constructor(...args: EIP1271EnforcerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = 'EIP1271Enforcer'
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<EIP1271Enforcer> {
    return super.deploy(overrides || {}) as Promise<EIP1271Enforcer>
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  attach(address: string): EIP1271Enforcer {
    return super.attach(address) as EIP1271Enforcer
  }
  connect(signer: Signer): EIP1271Enforcer__factory {
    return super.connect(signer) as EIP1271Enforcer__factory
  }
  static readonly contractName: 'EIP1271Enforcer'
  public readonly contractName: 'EIP1271Enforcer'
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): EIP1271EnforcerInterface {
    return new utils.Interface(_abi) as EIP1271EnforcerInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): EIP1271Enforcer {
    return new Contract(address, _abi, signerOrProvider) as EIP1271Enforcer
  }
}
