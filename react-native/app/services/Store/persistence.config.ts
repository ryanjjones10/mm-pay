import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
  persistReducer,
} from 'redux-persist'
import { Reducer } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { IS_DEV, appName } from '@app/config'
import { DataStore } from '@app/types'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

export const REDUX_PERSIST_ACTION_TYPES = [
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
]

export const APP_PERSIST_CONFIG: PersistConfig<DataStore> = {
  version: 0,
  key: 'Storage',
  keyPrefix: `${appName}_`,
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  debug: IS_DEV,
  writeFailHandler: (err) => {
    console.error(err)
  },
}

export const createPersistReducer = (reducer: Reducer<DataStore>) =>
  persistReducer(APP_PERSIST_CONFIG, reducer)
