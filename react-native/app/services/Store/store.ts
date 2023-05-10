import { configureStore, PreloadedState } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore } from 'redux-persist'

import { startBalancesPolling } from '@app/services/Store/account.slice'

import rootReducer, { AppState } from './root.reducer'
import rootSaga from './sagas'

export default function createStore(initialState?: PreloadedState<AppState>) {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        immutableCheck: false,
        thunk: false,
        serializableCheck: {
          ignoredActions: [
            // ignore pollStart to avoid errors with the methods passed in the payload of the action
            startBalancesPolling.type,
          ],
        },
      }),
      sagaMiddleware,
      // Logger MUST be last in chain.
      // https://github.com/LogRocket/redux-logger#usage
      //...(IS_DEV ? [createLogger({ collapsed: true })] : []),
    ],
  })
  const persistor = persistStore(store)

  // Activate HMR for store reducer
  // https://redux-toolkit.js.org/tutorials/advanced-tutorial#store-setup-and-hmr
  // if (module.hot && IS_DEV) {
  //   module.hot.accept('./root.reducer', () => {
  //     // https://github.com/rt2zz/redux-persist/blob/master/docs/hot-module-replacement.md
  //     import('./root.reducer').then(({ default: nextReducer }) =>
  //       store.replaceReducer(nextReducer),
  //     )
  //   })
  // }

  sagaMiddleware.run(rootSaga)

  return {
    store,
    persistor,
  }
}
