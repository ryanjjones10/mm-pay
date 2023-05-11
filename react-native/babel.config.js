module.exports = function (api) {
  api.cache(true)
  return {
    //include: ['./'],
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
      require.resolve('expo-router/babel'),
      [
        'module-resolver',
        {
          root: './',
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
          ],
          alias: {
            '@*': ['./app/*'],
            '@app': ['./app'],
            // '@config': ['./config'],
            // '@constants': ['./constants'],
            // '@services': ['./services'],
            // '@types': ['./types'],
            // '@utils': ['./utils'],
            // '@vendor': ['./vendor'],
          },
        },
      ],
    ],
  }
}
