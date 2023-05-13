import '@ethersproject/shims'
import { Wallet } from '@ethersproject/wallet'

import {
  Delegatable4337Account,
  Delegatable4337Account__factory,
  DelegatableContractsMap,
  LINEA_NETWORK_CONFIG,
} from '@app/constants'
import { DelegatableContractTypes } from '@app/types'
import { importedPaymaster } from '@app/constants/account'
import { ProviderHandler } from '@app/services/EthService'
import { ethers } from 'ethers'

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

  const provider = ProviderHandler.fetchProvider(LINEA_NETWORK_CONFIG);
  const paymasterWallet = new ethers.Wallet(
    importedPaymaster,
    provider
  )

  return await SmartAccountFactory.connect(paymasterWallet)
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
