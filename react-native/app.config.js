module.exports = {
  expo: {
    scheme: 'acme',
    web: {
      bundler: 'metro',
    },
    name: 'mm-pay',
    slug: 'mm-pay',
    extra: {
      METAMASK_PAY_TEST_PRIVATE_KEY: process.env.METAMASK_PAY_TEST_PRIVATE_KEY,
    },
  },
}
