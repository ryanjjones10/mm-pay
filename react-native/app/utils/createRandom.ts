// Import the crypto getRandomValues shim (**BEFORE** the shims)
import 'react-native-get-random-values'

// Import the the ethers shims (**BEFORE** ethers)
import '@ethersproject/shims'

// Import the ethers library
import { Wallet } from '@ethersproject/wallet'

export const createRandomWallet = () => {
  try {
    // Per ethersjs lib - If there is no crytographic random source, this will throw.
    const wallet = Wallet.createRandom()
    return wallet
  } catch (e) {
    console.error(e) // @todo: add proper logging
    return undefined
  }
}
