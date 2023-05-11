import Constants from 'expo-constants'
export const importedPrivateKey =
  process.env.METAMASK_PAY_TEST_PRIVATE_KEY ||
  Constants.expoConfig.extra?.metamaskPayTestPrivateKey

export const importedPrivateKeyTwo =
  process.env.METAMASK_PAY_TEST_PRIVATE_KEY_TWO ||
  Constants.expoConfig.extra?.metamaskPayTestPrivateKeyTwo

export const mockCreatePrivateKey = () => {
  if (!importedPrivateKeyTwo || importedPrivateKeyTwo === '') {
    console.error(
      'error saving mock private key from env var METAMASK_PAY_TEST_PRIVATE_KEY_TWO',
    )
  }
  return importedPrivateKeyTwo
}
