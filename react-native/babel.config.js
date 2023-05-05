module.exports = function (api) {
  api.cache(true)
  return {
    //include: ['./'],
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
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
