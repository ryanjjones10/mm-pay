import Constants from 'expo-constants'
export const importedPrivateKey =
  process.env.METAMASK_PAY_TEST_PRIVATE_KEY ||
  Constants.expoConfig.extra?.metamaskPayTestPrivateKey
