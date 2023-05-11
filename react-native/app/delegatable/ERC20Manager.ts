import { ethers } from 'ethers'
// import { expect } from 'chai'
import { Provider } from '@ethersproject/providers'
import { Contract, ContractFactory, Wallet } from 'ethers'
// import { time } from '@nomicfoundation/hardhat-network-helpers'

import { generateUtil } from 'eth-delegatable-utils'
import { getPrivateKeys } from './getPrivateKeys'
import { generateDelegation, getDeployedContract } from './utils'

async function getPermitSignature(
  signer: any,
  token: any,
  spender: any,
  value: any,
  deadline: any,
) {
  const [nonce, name, version, chainId] = await Promise.all([
    token.nonces(signer.address),
    token.name(),
    '1',
    signer.getChainId(),
  ])

  return ethers.utils.splitSignature(
    await signer._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: token.address,
      },
      {
        Permit: [
          {
            name: 'owner',
            type: 'address',
          },
          {
            name: 'spender',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      },
      {
        owner: signer.address,
        spender,
        value,
        nonce,
        deadline,
      },
    ),
  )
}

describe('ERC20Manager', () => {
  const CONTRACT_NAME = 'ERC20Manager'
  let CONTRACT_INFO: any
  let CURRENT_TIME: number
  let delegatableUtils: any

  let signer0: SignerWithAddress
  let signer1: SignerWithAddress
  let erc20ManagerContract: Contract
  let erc20ManagerFactory: ContractFactory
  let erc20PermitTokenFactory: ContractFactory
  let erc20PermitToken: Contract
  let wallet0: Wallet
  let wallet1: Wallet
  let wallet2: Wallet
  let wallet3: Wallet
  let wallet4: Wallet
  let pk0: string
  let pk1: string
  let erc20FromAllowanceEnforcer: Contract
  let erc20FromAllowanceEnforcerFactory: ContractFactory
  let timestampBeforeEnforcer: Contract
  let timestampBeforeEnforcerFactory: ContractFactory
  let timestampAfterEnforcer: Contract
  let timestampAfterEnforcerFactory: ContractFactory
  let allowedAddressEnforcer: Contract
  let allowedAddressEnforcerFactory: ContractFactory

  before(async () => {
    // CURRENT_TIME = await time.latest();
    ;[signer0, signer1] = await getSigners()
    ;[wallet0, wallet1, wallet2, wallet3, wallet4] = getPrivateKeys(
      signer0.provider as unknown as Provider,
    ) //
    erc20ManagerFactory = await ethers.getContractFactory('ERC20Manager')
    erc20PermitTokenFactory = await ethers.getContractFactory('TokenPermit')
    erc20FromAllowanceEnforcerFactory = await ethers.getContractFactory(
      'ERC20FromAllowanceEnforcer',
    )
    timestampBeforeEnforcerFactory = await ethers.getContractFactory(
      'TimestampBeforeEnforcer',
    )
    timestampAfterEnforcerFactory = await ethers.getContractFactory(
      'TimestampAfterEnforcer',
    )
    allowedAddressEnforcerFactory = await ethers.getContractFactory(
      'AllowedAddressEnforcer',
    )
    pk0 = wallet0._signingKey().privateKey
    pk1 = wallet1._signingKey().privateKey
  })

  beforeEach(async () => {
    // await network.provider.request({
    //   method: 'hardhat_reset',
    //   params: [],
    // });
    // erc20PermitToken = await erc20PermitTokenFactory.connect(wallet0).deploy();
    erc20PermitToken = await getDeployedContract('TokenPermit')
    await erc20PermitToken.deployed()

    // erc20ManagerContract = await erc20ManagerFactory.connect(wallet0).deploy();
    erc20ManagerContract = await getDeployedContract('ERC20Manager')
    await erc20ManagerContract.deployed()

    // erc20FromAllowanceEnforcer = await erc20FromAllowanceEnforcerFactory.connect(wallet0).deploy();
    erc20FromAllowanceEnforcer = await getDeployedContract(
      'ERC20FromAllowanceEnforcer',
    )

    // timestampBeforeEnforcer = await timestampBeforeEnforcerFactory.connect(wallet0).deploy();
    timestampBeforeEnforcer = await getDeployedContract(
      'TimestampBeforeEnforcer',
    )

    // timestampAfterEnforcer = await timestampAfterEnforcerFactory.connect(wallet0).deploy();
    timestampAfterEnforcer = await getDeployedContract('TimestampAfterEnforcer')

    // allowedAddressEnforcer = await allowedAddressEnforcerFactory.connect(wallet0).deploy();
    allowedAddressEnforcer = await getDeployedContract('AllowedAddressEnforcer')

    CONTRACT_INFO = {
      chainId: signer0.provider._network.chainId, //erc20ManagerContract.deployTransaction.chainId,
      verifyingContract: erc20ManagerContract.address,
      name: CONTRACT_NAME,
    }
    delegatableUtils = generateUtil(CONTRACT_INFO)
  })

  it('should SUCCEED to approveSubscriptiopn', async () => {
    expect(
      await erc20PermitToken.allowance(
        wallet0.address,
        erc20ManagerContract.address,
      ),
    ).to.equal(0)
    const deadline = ethers.constants.MaxUint256
    const totalApprovedAmount = 12
    const { v, r, s } = await getPermitSignature(
      wallet0,
      erc20PermitToken,
      erc20ManagerContract.address,
      totalApprovedAmount,
      deadline,
    )

    const INVOCATION_MESSAGE = {
      replayProtection: {
        nonce: '0x01',
        queue: Math.floor(Math.random() * 100000000),
      },
      batch: [
        {
          authority: [],
          transaction: {
            to: erc20ManagerContract.address,
            gasLimit: '210000000000000000',
            data: (
              await erc20ManagerContract.populateTransaction.approveTransferProxy(
                erc20PermitToken.address,
                wallet0.address,
                totalApprovedAmount,
                deadline,
                v,
                r,
                s,
              )
            ).data,
          },
        },
      ],
    }

    const invocation = delegatableUtils.signInvocation(INVOCATION_MESSAGE, pk1)

    const tx = await erc20ManagerContract.invoke([
      {
        signature: invocation.signature,
        invocations: invocation.invocations,
      },
    ])
    expect(
      await erc20PermitToken.allowance(
        wallet0.address,
        erc20ManagerContract.address,
      ),
    ).to.equal(totalApprovedAmount)
  })

  it.only('should SUCCEED to INVOKE transferProxy', async () => {
    // expect(
    //   await erc20PermitToken.allowance(wallet0.address, erc20ManagerContract.address),
    // ).to.equal(12);
    const deadline = ethers.constants.MaxUint256
    const totalApprovedAmount = ethers.utils.parseEther('0.5')
    const { v, r, s } = await getPermitSignature(
      wallet0,
      erc20PermitToken,
      erc20ManagerContract.address,
      totalApprovedAmount,
      deadline,
    )

    const inputTerms = ethers.utils.hexZeroPad(
      ethers.utils.parseEther('0.5').toHexString(),
      32,
    )

    const _delegation = generateDelegation(
      CONTRACT_NAME,
      erc20ManagerContract,
      pk0,
      wallet1.address,
      [
        {
          enforcer: erc20FromAllowanceEnforcer.address,
          terms: inputTerms,
        },
      ],
    )

    const INVOCATION_MESSAGE = {
      replayProtection: {
        nonce: '0x01', //await signer0.provider.getTransactionCount(signer1.address) + 1,
        queue: Math.floor(Math.random() * 100000000),
      },
      batch: [
        {
          authority: [],
          transaction: {
            to: erc20ManagerContract.address,
            gasLimit: '210000000000000000',
            data: (
              await erc20ManagerContract.populateTransaction.approveTransferProxy(
                erc20PermitToken.address,
                wallet0.address,
                totalApprovedAmount,
                deadline,
                v,
                r,
                s,
              )
            ).data,
          },
        },
        {
          authority: [_delegation],
          transaction: {
            to: erc20ManagerContract.address,
            gasLimit: '210000000000000000',
            data: (
              await erc20ManagerContract.populateTransaction.transferProxy(
                erc20PermitToken.address,
                wallet1.address,
                totalApprovedAmount,
              )
            ).data,
          },
        },
      ],
    }

    console.log('nonce', INVOCATION_MESSAGE.replayProtection.nonce)

    const invocation = delegatableUtils.signInvocation(INVOCATION_MESSAGE, pk1)

    console.log('invocation', JSON.stringify(invocation))

    // let tx = await erc20ManagerContract.invoke([
    //   {
    //     signature: invocation.signature,
    //     invocations: invocation.invocations,
    //   },
    // ]);

    // console.log('tthjth', tx)

    // expect(await erc20PermitToken.balanceOf(wallet1.address)).to.equal(totalApprovedAmount);
  })
})
