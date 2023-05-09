import { delegationTypes } from '@app/types/delegation'

export const createDelegation = ({
  destinationWalletAddress,
  verifyingContractAddress,
  caveats,
  chainId,
}: {
  destinationWalletAddress: string
  verifyingContractAddress: string
  caveats: { enforcer: string; terms: any }[]
  chainId: number
}) => {
  const delegation = {
    delegate: destinationWalletAddress,
    authority:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    caveats: caveats,
  }

  const domain = {
    name: 'ERC20Manager',
    version: '1',
    chainId,
  }

  const delegationString = JSON.stringify({
    domain: { ...domain, verifyingContractAddress },
    message: delegation,
    primaryType: 'Delegation',
    types: delegationTypes,
  })
  return {
    delegation,
    string: delegationString,
  }
}
