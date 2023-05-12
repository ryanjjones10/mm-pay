module.exports = {
  expo: {
    scheme: 'acme',
    web: {
      bundler: 'metro',
    },
    name: 'mm-pay',
    slug: 'mm-pay',
    extra: {
      metamaskPayTestPrivateKey: process.env.METAMASK_PAY_TEST_PRIVATE_KEY,
      metamaskPayTestPrivateKeyTwo:
        process.env.METAMASK_PAY_TEST_PRIVATE_KEY_TWO,
      pimlicoAPIKey: process.env.PIMLICO_API_KEY,
    },
  },
}
