/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  TokenCallbackHandler,
  TokenCallbackHandlerInterface,
} from '../TokenCallbackHandler'

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC1155Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'onERC721Received',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'tokensReceived',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
]

const _bytecode =
  '0x608060405234801561001057600080fd5b50610581806100206000396000f3fe608060405234801561001057600080fd5b50600436106100565760003560e01c806223de291461005b57806301ffc9a714610075578063150b7a021461009e578063bc197c81146100ca578063f23a6e61146100ec575b600080fd5b6100736100693660046101f3565b5050505050505050565b005b6100886100833660046102dc565b61010c565b604051610095919061030f565b60405180910390f35b6100bd6100ac36600461031d565b630a85bd0160e11b95945050505050565b60405161009591906103a9565b6100bd6100d8366004610401565b63bc197c8160e01b98975050505050505050565b6100bd6100fa3660046104b6565b63f23a6e6160e01b9695505050505050565b60006001600160e01b03198216630a85bd0160e11b148061013d57506001600160e01b03198216630271189760e51b145b8061015857506001600160e01b031982166301ffc9a760e01b145b92915050565b60006001600160a01b038216610158565b6101788161015e565b811461018357600080fd5b50565b80356101588161016f565b80610178565b803561015881610191565b60008083601f8401126101b7576101b7600080fd5b5081356001600160401b038111156101d1576101d1600080fd5b6020830191508360018202830111156101ec576101ec600080fd5b9250929050565b60008060008060008060008060c0898b03121561021257610212600080fd5b600061021e8b8b610186565b985050602061022f8b828c01610186565b97505060406102408b828c01610186565b96505060606102518b828c01610197565b95505060808901356001600160401b0381111561027057610270600080fd5b61027c8b828c016101a2565b945094505060a08901356001600160401b0381111561029d5761029d600080fd5b6102a98b828c016101a2565b92509250509295985092959890939650565b6001600160e01b03191690565b610178816102bb565b8035610158816102c8565b6000602082840312156102f1576102f1600080fd5b60006102fd84846102d1565b949350505050565b8015155b82525050565b602081016101588284610305565b60008060008060006080868803121561033857610338600080fd5b60006103448888610186565b955050602061035588828901610186565b945050604061036688828901610197565b93505060608601356001600160401b0381111561038557610385600080fd5b610391888289016101a2565b92509250509295509295909350565b610309816102bb565b6020810161015882846103a0565b60008083601f8401126103cc576103cc600080fd5b5081356001600160401b038111156103e6576103e6600080fd5b6020830191508360208202830111156101ec576101ec600080fd5b60008060008060008060008060a0898b03121561042057610420600080fd5b600061042c8b8b610186565b985050602061043d8b828c01610186565b97505060408901356001600160401b0381111561045c5761045c600080fd5b6104688b828c016103b7565b965096505060608901356001600160401b0381111561048957610489600080fd5b6104958b828c016103b7565b945094505060808901356001600160401b0381111561029d5761029d600080fd5b60008060008060008060a087890312156104d2576104d2600080fd5b60006104de8989610186565b96505060206104ef89828a01610186565b955050604061050089828a01610197565b945050606061051189828a01610197565b93505060808701356001600160401b0381111561053057610530600080fd5b61053c89828a016101a2565b9250925050929550929550929556fea2646970667358221220eb37d19b9ce2450623ce81e652ce4abcb76a5c6ca4605ff92ec87fe2136155e364736f6c63430008120033'

type TokenCallbackHandlerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: TokenCallbackHandlerConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class TokenCallbackHandler__factory extends ContractFactory {
  constructor(...args: TokenCallbackHandlerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = 'TokenCallbackHandler'
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<TokenCallbackHandler> {
    return super.deploy(overrides || {}) as Promise<TokenCallbackHandler>
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  attach(address: string): TokenCallbackHandler {
    return super.attach(address) as TokenCallbackHandler
  }
  connect(signer: Signer): TokenCallbackHandler__factory {
    return super.connect(signer) as TokenCallbackHandler__factory
  }
  static readonly contractName: 'TokenCallbackHandler'
  public readonly contractName: 'TokenCallbackHandler'
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): TokenCallbackHandlerInterface {
    return new utils.Interface(_abi) as TokenCallbackHandlerInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): TokenCallbackHandler {
    return new Contract(address, _abi, signerOrProvider) as TokenCallbackHandler
  }
}
