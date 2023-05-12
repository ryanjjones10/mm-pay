// Useless comment that somehow fixes the bundler

import Constants from 'expo-constants'

export const pimlicoAPIKey =
  process.env.PIMLICO_API_KEY || Constants.expoConfig.extra?.pimlicoAPIKey

export const importedPrivateKey =
  process.env.METAMASK_PAY_TEST_PRIVATE_KEY ||
  Constants.expoConfig.extra?.metamaskPayTestPrivateKey

export const importedPrivateKeyTwo =
  process.env.METAMASK_PAY_TEST_PRIVATE_KEY_TWO ||
  Constants.expoConfig.extra?.metamaskPayTestPrivateKeyTwo

export const importedPaymaster =
  process.env.METAMASK_PAY_TEST_PAYMASTER ||
  Constants.expoConfig.extra?.metamaskPayTestPaymaster

export const mockCreatePrivateKey = () => {
  if (!importedPrivateKeyTwo || importedPrivateKeyTwo === '') {
    console.error(
      'error saving mock private key from env var METAMASK_PAY_TEST_PRIVATE_KEY_TWO',
    )
  }
  return importedPrivateKeyTwo
}
