import { id } from '@ethersproject/hash'

export const createDelegation = ({
  destinationWalletAddress,
}: {
  destinationWalletAddress: string
}) => {
  const delegation = {
    delegate: destinationWalletAddress,
    authority:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    caveats: [
      {
        enforcer: 'INSERT_ENFORCER_ADDRESS',
        terms: 'INSERT_CUSTOM_LOGIC',
      },
    ],
  }
  return id(JSON.stringify(delegation))
}
