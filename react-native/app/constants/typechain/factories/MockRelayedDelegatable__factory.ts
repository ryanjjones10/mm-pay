/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  MockRelayedDelegatable,
  MockRelayedDelegatableInterface,
} from '../MockRelayedDelegatable'

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trustedRelay',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'purpose',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'purpose_',
        type: 'string',
      },
    ],
    name: 'setPurpose',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'trustedRelay',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const _bytecode =
  '0x60c0604052601360809081527f57686174206973206d7920707572706f73653f0000000000000000000000000060a0526001906200003e9082620002a7565b503480156200004c57600080fd5b5060405162000b8738038062000b878339810160408190526200006f91620003af565b620000836200007d620000a9565b62000113565b600280546001600160a01b0319166001600160a01b0392909216919091179055620003dc565b6002546000906001600160a01b031633036200010d57600080368080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050503601516001600160a01b03169150620001109050565b50335b90565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052602260045260246000fd5b600281046001821680620001a457607f821691505b602082108103620001b957620001b962000179565b50919050565b6000620001cd620001108381565b92915050565b620001de83620001bf565b81546008840282811b60001990911b908116901990911617825550505050565b60006200020d818484620001d3565b505050565b81811015620002315762000228600082620001fe565b60010162000212565b5050565b601f8211156200020d576000818152602090206020601f850104810160208510156200025e5750805b620002726020601f86010483018262000212565b5050505050565b6000196008929092029190911c191690565b600062000299838362000279565b600290930290921792915050565b81516001600160401b03811115620002c357620002c362000163565b620002cf82546200018f565b620002dc82828562000235565b6020601f8311600181146200030f5760008415620002fa5750858201515b6200030685826200028b565b8655506200036e565b600085815260208120601f198616915b828110156200034157888501518255602094850194600190920191016200031f565b868310156200036157848901516200035d601f89168262000279565b8355505b6001600288020188555050505b505050505050565b60006001600160a01b038216620001cd565b620003938162000376565b81146200039f57600080fd5b50565b8051620001cd8162000388565b600060208284031215620003c657620003c6600080fd5b6000620003d48484620003a2565b949350505050565b61079b80620003ec6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806370740aab14610067578063715018a6146100855780638da5cb5b1461008f578063c0edf3da146100a4578063eb68757f146100b7578063f2fde38b146100ca575b600080fd5b61006f6100dd565b60405161007c919061034e565b60405180910390f35b61008d61016b565b005b61009761017f565b60405161007c9190610388565b600254610097906001600160a01b031681565b61008d6100c5366004610499565b61018e565b61008d6100d83660046104f2565b6101a6565b600180546100ea90610529565b80601f016020809104026020016040519081016040528092919081815260200182805461011690610529565b80156101635780601f1061013857610100808354040283529160200191610163565b820191906000526020600020905b81548152906001019060200180831161014657829003601f168201915b505050505081565b6101736101e9565b61017d6000610228565b565b6000546001600160a01b031690565b6101966101e9565b60016101a28282610623565b5050565b6101ae6101e9565b6001600160a01b0381166101dd5760405162461bcd60e51b81526004016101d4906106e1565b60405180910390fd5b6101e681610228565b50565b6101f1610278565b6001600160a01b031661020261017f565b6001600160a01b03161461017d5760405162461bcd60e51b81526004016101d49061072b565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6002546000906001600160a01b031633036102da57600080368080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050503601516001600160a01b031691506102dd9050565b50335b90565b60005b838110156102fb5781810151838201526020016102e3565b8381111561030a576000848401525b50505050565b601f01601f191690565b6000610324825190565b80845260208401935061033b8185602086016102e0565b61034481610310565b9093019392505050565b6020808252810161035f818461031a565b9392505050565b60006001600160a01b0382165b92915050565b61038281610366565b82525050565b602081016103738284610379565b634e487b7160e01b600052604160045260246000fd5b6103b582610310565b81018181106001600160401b03821117156103d2576103d2610396565b6040525050565b60006103e460405190565b90506103f082826103ac565b919050565b60006001600160401b0382111561040e5761040e610396565b61041782610310565b60200192915050565b82818337506000910152565b600061043f61043a846103f5565b6103d9565b90508281526020810184848401111561045a5761045a600080fd5b610465848285610420565b509392505050565b600082601f83011261048157610481600080fd5b813561049184826020860161042c565b949350505050565b6000602082840312156104ae576104ae600080fd5b81356001600160401b038111156104c7576104c7600080fd5b6104918482850161046d565b6104dc81610366565b81146101e657600080fd5b8035610373816104d3565b60006020828403121561050757610507600080fd5b600061049184846104e7565b634e487b7160e01b600052602260045260246000fd5b60028104600182168061053d57607f821691505b60208210810361054f5761054f610513565b50919050565b60006103736102dd8381565b61056a83610555565b81546008840282811b60001990911b908116901990911617825550505050565b6000610597818484610561565b505050565b818110156101a2576105af60008261058a565b60010161059c565b601f821115610597576000818152602090206020601f850104810160208510156105de5750805b6105f06020601f86010483018261059c565b5050505050565b6000196008929092029190911c191690565b600061061583836105f7565b600290930290921792915050565b81516001600160401b0381111561063c5761063c610396565b6106468254610529565b6106518282856105b7565b6020601f83116001811461067f576000841561066d5750858201515b6106778582610609565b8655506106d9565b600085815260208120601f198616915b828110156106af578885015182556020948501946001909201910161068f565b868310156106cc57848901516106c8601f8916826105f7565b8355505b6001600288020188555050505b505050505050565b6020808252810161037381602681527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160208201526564647265737360d01b604082015260600190565b60208082528181019081527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260408301526060820161037356fea2646970667358221220e09b9a16453e85280cf8127d817962f4b8eac83d4e461f92031bec78cb9e8ed064736f6c634300080f0033'

type MockRelayedDelegatableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: MockRelayedDelegatableConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class MockRelayedDelegatable__factory extends ContractFactory {
  constructor(...args: MockRelayedDelegatableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = 'MockRelayedDelegatable'
  }

  deploy(
    _trustedRelay: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<MockRelayedDelegatable> {
    return super.deploy(
      _trustedRelay,
      overrides || {},
    ) as Promise<MockRelayedDelegatable>
  }
  getDeployTransaction(
    _trustedRelay: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(_trustedRelay, overrides || {})
  }
  attach(address: string): MockRelayedDelegatable {
    return super.attach(address) as MockRelayedDelegatable
  }
  connect(signer: Signer): MockRelayedDelegatable__factory {
    return super.connect(signer) as MockRelayedDelegatable__factory
  }
  static readonly contractName: 'MockRelayedDelegatable'
  public readonly contractName: 'MockRelayedDelegatable'
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): MockRelayedDelegatableInterface {
    return new utils.Interface(_abi) as MockRelayedDelegatableInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): MockRelayedDelegatable {
    return new Contract(
      address,
      _abi,
      signerOrProvider,
    ) as MockRelayedDelegatable
  }
}