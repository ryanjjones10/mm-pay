import React from 'react'
import { Stack } from 'expo-router/stack'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import createStore from './services/Store/store'
import { persistStore } from 'redux-persist'

const Layout = () => {
  const { store } = createStore()
  const persistor = persistStore(store)

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack initialRouteName="index" />
      </PersistGate>
    </Provider>
  )
}

export default Layout