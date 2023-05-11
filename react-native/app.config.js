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
    },
  },
}
