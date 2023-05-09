import { PersistConfig, persistReducer } from 'redux-persist'
import { Reducer } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { IS_DEV, appName } from '@app/config'
import { DataStore } from '@app/types'

export const APP_PERSIST_CONFIG: PersistConfig<DataStore> = {
  version: 6,
  key: 'Storage',
  keyPrefix: `${appName}_`,
  storage: AsyncStorage,
  blacklist: [],
  transforms: [],
  debug: IS_DEV,
}

export const createPersistReducer = (reducer: Reducer<DataStore>) =>
  persistReducer(APP_PERSIST_CONFIG, reducer)
