/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import '@ethersproject/shims'
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  DiamondCutFacet,
  DiamondCutFacetInterface,
} from '../DiamondCutFacet'

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'facetAddress',
            type: 'address',
          },
          {
            internalType: 'enum IDiamondCut.FacetCutAction',
            name: 'action',
            type: 'uint8',
          },
          {
            internalType: 'bytes4[]',
            name: 'functionSelectors',
            type: 'bytes4[]',
          },
        ],
        indexed: false,
        internalType: 'struct IDiamondCut.FacetCut[]',
        name: '_diamondCut',
        type: 'tuple[]',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_init',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: '_calldata',
        type: 'bytes',
      },
    ],
    name: 'DiamondCut',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'facetAddress',
            type: 'address',
          },
          {
            internalType: 'enum IDiamondCut.FacetCutAction',
            name: 'action',
            type: 'uint8',
          },
          {
            internalType: 'bytes4[]',
            name: 'functionSelectors',
            type: 'bytes4[]',
          },
        ],
        internalType: 'struct IDiamondCut.FacetCut[]',
        name: '_diamondCut',
        type: 'tuple[]',
      },
      {
        internalType: 'address',
        name: '_init',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_calldata',
        type: 'bytes',
      },
    ],
    name: 'diamondCut',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const _bytecode =
  '0x608060405234801561001057600080fd5b50611736806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80631f931c1c14610030575b600080fd5b61004361003e366004610caa565b610045565b005b61004d61009e565b61009761005a8587610f6d565b8484848080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506100ec92505050565b5050505050565b6100a66102bd565b600401546001600160a01b03166100bb6102e1565b6001600160a01b0316146100ea5760405162461bcd60e51b81526004016100e190610fc3565b60405180910390fd5b565b60005b835181101561027257600084828151811061010c5761010c610fd3565b60200260200101516020015190506000600281111561012d5761012d610fe9565b81600281111561013f5761013f610fe9565b0361018d5761018885838151811061015957610159610fd3565b60200260200101516000015186848151811061017757610177610fd3565b60200260200101516040015161033d565b61025f565b60018160028111156101a1576101a1610fe9565b036101ea576101888583815181106101bb576101bb610fd3565b6020026020010151600001518684815181106101d9576101d9610fd3565b602002602001015160400151610464565b60028160028111156101fe576101fe610fe9565b036102475761018885838151811061021857610218610fd3565b60200260200101516000015186848151811061023657610236610fd3565b60200260200101516040015161059b565b60405162461bcd60e51b81526004016100e190611043565b508061026a81611069565b9150506100ef565b507f8faa70878671ccd212d20771b795c50af8fd3ff6cf27f4bde57e5d4de0aeb6738383836040516102a693929190611238565b60405180910390a16102b88282610667565b505050565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c90565b600030330361033757600080368080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050503601516001600160a01b0316915061033a9050565b50335b90565b600081511161035e5760405162461bcd60e51b81526004016100e1906112b2565b60006103686102bd565b90506001600160a01b0383166103905760405162461bcd60e51b81526004016100e19061130b565b6001600160a01b0383166000908152600182016020526040812054906001600160601b03821690036103c6576103c68285610789565b60005b83518110156100975760008482815181106103e6576103e6610fd3565b6020908102919091018101516001600160e01b031981166000908152918690526040909120549091506001600160a01b031680156104365760405162461bcd60e51b81526004016100e19061136d565b6104428583868a6107f3565b8361044c8161137d565b9450505050808061045c90611069565b9150506103c9565b60008151116104855760405162461bcd60e51b81526004016100e1906112b2565b600061048f6102bd565b90506001600160a01b0383166104b75760405162461bcd60e51b81526004016100e19061130b565b6001600160a01b0383166000908152600182016020526040812054906001600160601b03821690036104ed576104ed8285610789565b60005b835181101561009757600084828151811061050d5761050d610fd3565b6020908102919091018101516001600160e01b031981166000908152918690526040909120549091506001600160a01b0390811690871681036105625760405162461bcd60e51b81526004016100e1906113f4565b61056d858284610893565b6105798583868a6107f3565b836105838161137d565b9450505050808061059390611069565b9150506104f0565b60008151116105bc5760405162461bcd60e51b81526004016100e1906112b2565b60006105c66102bd565b90506001600160a01b038316156105ef5760405162461bcd60e51b81526004016100e190611457565b60005b825181101561066157600083828151811061060f5761060f610fd3565b6020908102919091018101516001600160e01b031981166000908152918590526040909120549091506001600160a01b031661064c848284610893565b5050808061065990611069565b9150506105f2565b50505050565b6001600160a01b038216610698578051156106945760405162461bcd60e51b81526004016100e1906114c0565b5050565b60008151116106b95760405162461bcd60e51b81526004016100e19061152a565b6001600160a01b03821630146106eb576106eb826040518060600160405280602881526020016116b560289139610bb9565b600080836001600160a01b031683604051610706919061155c565b600060405180830381855af49150503d8060008114610741576040519150601f19603f3d011682016040523d82523d6000602084013e610746565b606091505b50915091508161066157805115610771578060405162461bcd60e51b81526004016100e19190611568565b60405162461bcd60e51b81526004016100e1906115bc565b6107ab816040518060600160405280602481526020016116dd60249139610bb9565b6002820180546001600160a01b0390921660008181526001948501602090815260408220860185905594840183559182529290200180546001600160a01b0319169091179055565b6001600160e01b0319831660008181526020868152604080832080546001600160601b03909716600160a01b026001600160a01b0397881617815594909516808352600180890183529583208054968701815583528183206008870401805460e09890981c60046007909816979097026101000a96870263ffffffff9097021990971695909517909555529290915281546001600160a01b031916179055565b6001600160a01b0382166108b95760405162461bcd60e51b81526004016100e190611620565b306001600160a01b038316036108e15760405162461bcd60e51b81526004016100e19061167b565b6001600160e01b03198116600090815260208481526040808320546001600160a01b0386168452600180880190935290832054600160a01b9091046001600160601b031692916109309161168b565b9050808214610a22576001600160a01b0384166000908152600186016020526040812080548390811061096557610965610fd3565b600091825260208083206008830401546001600160a01b038916845260018a019091526040909220805460079092166004026101000a90920460e01b9250829190859081106109b6576109b6610fd3565b600091825260208083206008830401805463ffffffff60079094166004026101000a938402191660e09590951c929092029390931790556001600160e01b03199290921682528690526040902080546001600160a01b0316600160a01b6001600160601b038516021790555b6001600160a01b03841660009081526001860160205260409020805480610a4b57610a4b61169e565b60008281526020808220600860001990940193840401805463ffffffff600460078716026101000a0219169055919092556001600160e01b03198516825286905260408120819055819003610097576002850154600090610aae9060019061168b565b6001600160a01b0386166000908152600180890160205260409091200154909150808214610b5d576000876002018381548110610aed57610aed610fd3565b6000918252602090912001546002890180546001600160a01b039092169250829184908110610b1e57610b1e610fd3565b600091825260208083209190910180546001600160a01b0319166001600160a01b03948516179055929091168152600189810190925260409020018190555b86600201805480610b7057610b7061169e565b60008281526020808220830160001990810180546001600160a01b03191690559092019092556001600160a01b0388168252600189810190915260408220015550505050505050565b813b81816106615760405162461bcd60e51b81526004016100e19190611568565b60008083601f840112610bef57610bef600080fd5b5081356001600160401b03811115610c0957610c09600080fd5b602083019150836020820283011115610c2457610c24600080fd5b9250929050565b60006001600160a01b0382165b92915050565b610c4781610c2b565b8114610c5257600080fd5b50565b8035610c3881610c3e565b60008083601f840112610c7557610c75600080fd5b5081356001600160401b03811115610c8f57610c8f600080fd5b602083019150836001820283011115610c2457610c24600080fd5b600080600080600060608688031215610cc557610cc5600080fd5b85356001600160401b03811115610cde57610cde600080fd5b610cea88828901610bda565b95509550506020610cfd88828901610c55565b93505060408601356001600160401b03811115610d1c57610d1c600080fd5b610d2888828901610c60565b92509250509295509295909350565b601f01601f191690565b634e487b7160e01b600052604160045260246000fd5b610d6082610d37565b81018181106001600160401b0382111715610d7d57610d7d610d41565b6040525050565b6000610d8f60405190565b9050610d9b8282610d57565b919050565b60006001600160401b03821115610db957610db9610d41565b5060209081020190565b60038110610c5257600080fd5b8035610c3881610dc3565b6001600160e01b03191690565b610c4781610ddb565b8035610c3881610de8565b6000610e0f610e0a84610da0565b610d84565b83815290506020808201908402830185811115610e2e57610e2e600080fd5b835b81811015610e525780610e438882610df1565b84525060209283019201610e30565b5050509392505050565b600082601f830112610e7057610e70600080fd5b8135610e80848260208601610dfc565b949350505050565b600060608284031215610e9d57610e9d600080fd5b610ea76060610d84565b90506000610eb58484610c55565b8252506020610ec684848301610dd0565b60208301525060408201356001600160401b03811115610ee857610ee8600080fd5b610ef484828501610e5c565b60408301525092915050565b6000610f0e610e0a84610da0565b83815290506020808201908402830185811115610f2d57610f2d600080fd5b835b81811015610e525780356001600160401b03811115610f5057610f50600080fd5b808601610f5d8982610e88565b8552505060209283019201610f2f565b6000610f7a368484610f00565b9392505050565b602281526000602082017f4c69624469616d6f6e643a204d75737420626520636f6e7472616374206f776e81526132b960f11b602082015291505b5060400190565b60208082528101610c3881610f81565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b602781526000602082017f4c69624469616d6f6e644375743a20496e636f727265637420466163657443758152663a20b1ba34b7b760c91b60208201529150610fbc565b60208082528101610c3881610fff565b634e487b7160e01b600052601160045260246000fd5b6000600019820361107c5761107c611053565b5060010190565b61108c81610c2b565b82525050565b60038110610c5257610c52610fe9565b80610d9b81611092565b6000610c38826110a2565b61108c816110ac565b61108c81610ddb565b60006110d583836110c0565b505060200190565b60006110e7825190565b80845260209384019383018060005b8381101561111b57815161110a88826110c9565b9750602083019250506001016110f6565b509495945050505050565b8051600090606084019061113a8582611083565b50602083015161114d60208601826110b7565b506040830151848203604086015261116582826110dd565b95945050505050565b6000610f7a8383611126565b6000611184825190565b8084526020840193508360208202850161119e8560200190565b8060005b858110156111d357848403895281516111bb858261116e565b94506020830160209a909a01999250506001016111a2565b5091979650505050505050565b60005b838110156111fb5781810151838201526020016111e3565b50506000910152565b600061120e825190565b8084526020840193506112258185602086016111e0565b61122e81610d37565b9093019392505050565b60608082528101611249818661117a565b90506112586020830185611083565b81810360408301526111658184611204565b602b81526000602082017f4c69624469616d6f6e644375743a204e6f2073656c6563746f727320696e206681526a1858d95d081d1bc818dd5d60aa1b60208201529150610fbc565b60208082528101610c388161126a565b602c81526000602082017f4c69624469616d6f6e644375743a204164642066616365742063616e2774206281526b65206164647265737328302960a01b60208201529150610fbc565b60208082528101610c38816112c2565b603581526000602082017f4c69624469616d6f6e644375743a2043616e2774206164642066756e6374696f8152746e207468617420616c72656164792065786973747360581b60208201529150610fbc565b60208082528101610c388161131b565b6001600160601b031660006002600160601b0319820161107c5761107c611053565b603881526000602082017f4c69624469616d6f6e644375743a2043616e2774207265706c6163652066756e81527731ba34b7b7103bb4ba341039b0b6b290333ab731ba34b7b760411b60208201529150610fbc565b60208082528101610c388161139f565b603681526000602082017f4c69624469616d6f6e644375743a2052656d6f76652066616365742061646472815275657373206d757374206265206164647265737328302960501b60208201529150610fbc565b60208082528101610c3881611404565b603c81526000602082017f4c69624469616d6f6e644375743a205f696e697420697320616464726573732881527b3029206275745f63616c6c64617461206973206e6f7420656d70747960201b60208201529150610fbc565b60208082528101610c3881611467565b603d81526000602082017f4c69624469616d6f6e644375743a205f63616c6c6461746120697320656d707481527f7920627574205f696e6974206973206e6f74206164647265737328302900000060208201529150610fbc565b60208082528101610c38816114d0565b6000611544825190565b6115528185602086016111e0565b9290920192915050565b6000610f7a828461153a565b60208082528101610f7a8184611204565b602681526000602082017f4c69624469616d6f6e644375743a205f696e69742066756e6374696f6e2072658152651d995c9d195960d21b60208201529150610fbc565b60208082528101610c3881611579565b603781526000602082017f4c69624469616d6f6e644375743a2043616e27742072656d6f76652066756e638152761d1a5bdb881d1a185d08191bd95cdb89dd08195e1a5cdd604a1b60208201529150610fbc565b60208082528101610c38816115cc565b602e81526000602082017f4c69624469616d6f6e644375743a2043616e27742072656d6f766520696d6d7581526d3a30b1363290333ab731ba34b7b760911b60208201529150610fbc565b60208082528101610c3881611630565b81810381811115610c3857610c38611053565b634e487b7160e01b600052603160045260246000fdfe4c69624469616d6f6e644375743a205f696e6974206164647265737320686173206e6f20636f64654c69624469616d6f6e644375743a204e657720666163657420686173206e6f20636f6465a264697066735822122001395e38456db433c189e0cbf44e394573a7ae503412d653599cd4369394ac5764736f6c63430008120033'

type DiamondCutFacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (
  xs: DiamondCutFacetConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1

export class DiamondCutFacet__factory extends ContractFactory {
  constructor(...args: DiamondCutFacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args)
    } else {
      super(_abi, _bytecode, args[0])
    }
    this.contractName = 'DiamondCutFacet'
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<DiamondCutFacet> {
    return super.deploy(overrides || {}) as Promise<DiamondCutFacet>
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  attach(address: string): DiamondCutFacet {
    return super.attach(address) as DiamondCutFacet
  }
  connect(signer: Signer): DiamondCutFacet__factory {
    return super.connect(signer) as DiamondCutFacet__factory
  }
  static readonly contractName: 'DiamondCutFacet'
  public readonly contractName: 'DiamondCutFacet'
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): DiamondCutFacetInterface {
    return new utils.Interface(_abi) as DiamondCutFacetInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): DiamondCutFacet {
    return new Contract(address, _abi, signerOrProvider) as DiamondCutFacet
  }
}
