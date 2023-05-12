import '@ethersproject/shims'
import { Wallet } from '@ethersproject/wallet'

import {
  Delegatable4337Account,
  Delegatable4337Account__factory,
  DelegatableContractsMap,
} from '@app/constants'
import { DelegatableContractTypes } from '@app/types'

export const deployNew4337DelegatableSmartAccount = async (
  wallet: Wallet,
): Promise<Delegatable4337Account | undefined> => {
  const SmartAccountFactory = new Delegatable4337Account__factory()
  const walletAddr = await wallet.getAddress()
  if (!walletAddr) {
    console.debug(
      '[deployNewContractWallet] Error getting wallet address for signer',
    )
  }
  return await SmartAccountFactory.connect(wallet)
    .deploy(
      DelegatableContractsMap[DelegatableContractTypes.Entrypoint],
      [walletAddr],
      1,
    )
    .catch((e) => {
      console.error(
        '[deployNewContractWallet] Error deploying contract wallet: ',
        e,
      )
      return undefined
    })
}
