/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  TimestampAfterEnforcer,
  TimestampAfterEnforcerInterface,
} from '../TimestampAfterEnforcer'

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
  '0x608060405234801561001057600080fd5b506104dd806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80635068de4c14610030575b600080fd5b61004a60048036038101906100459190610243565b610060565b60405161005791906102ee565b60405180910390f35b6000806100b286868080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050506000610113565b9050428167ffffffffffffffff1610156100d057600191505061010b565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101029061038c565b60405180910390fd5b949350505050565b600060088261012291906103e5565b83511015610165576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161015c90610487565b60405180910390fd5b60008260088501015190508091505092915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f8401126101a9576101a8610184565b5b8235905067ffffffffffffffff8111156101c6576101c5610189565b5b6020830191508360018202830111156101e2576101e161018e565b5b9250929050565b600080fd5b600060608284031215610204576102036101e9565b5b81905092915050565b6000819050919050565b6102208161020d565b811461022b57600080fd5b50565b60008135905061023d81610217565b92915050565b6000806000806060858703121561025d5761025c61017a565b5b600085013567ffffffffffffffff81111561027b5761027a61017f565b5b61028787828801610193565b9450945050602085013567ffffffffffffffff8111156102aa576102a961017f565b5b6102b6878288016101ee565b92505060406102c78782880161022e565b91505092959194509250565b60008115159050919050565b6102e8816102d3565b82525050565b600060208201905061030360008301846102df565b92915050565b600082825260208201905092915050565b7f54696d657374616d704166746572456e666f726365723a6561726c792d64656c60008201527f65676174696f6e00000000000000000000000000000000000000000000000000602082015250565b6000610376602783610309565b91506103818261031a565b604082019050919050565b600060208201905081810360008301526103a581610369565b9050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006103f0826103ac565b91506103fb836103ac565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156104305761042f6103b6565b5b828201905092915050565b7f746f55696e7436345f6f75744f66426f756e6473000000000000000000000000600082015250565b6000610471601483610309565b915061047c8261043b565b602082019050919050565b600060208201905081810360008301526104a081610464565b905091905056fea2646970667358221220c2ae9221d9d42ebd7caffc54fbad616a79b458d4fd47ada93bed0c8d1b95a9a864736f6c634300080f0033'

type TimestampAfterEnforcerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: TimestampAfterEnforcerConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class TimestampAfterEnforcer__factory extends ContractFactory {
  constructor(...args: TimestampAfterEnforcerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = 'TimestampAfterEnforcer'
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<TimestampAfterEnforcer> {
    return super.deploy(overrides || {}) as Promise<TimestampAfterEnforcer>
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  attach(address: string): TimestampAfterEnforcer {
    return super.attach(address) as TimestampAfterEnforcer
  }
  connect(signer: Signer): TimestampAfterEnforcer__factory {
    return super.connect(signer) as TimestampAfterEnforcer__factory
  }
  static readonly contractName: 'TimestampAfterEnforcer'
  public readonly contractName: 'TimestampAfterEnforcer'
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): TimestampAfterEnforcerInterface {
    return new utils.Interface(_abi) as TimestampAfterEnforcerInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): TimestampAfterEnforcer {
    return new Contract(
      address,
      _abi,
      signerOrProvider,
    ) as TimestampAfterEnforcer
  }
}