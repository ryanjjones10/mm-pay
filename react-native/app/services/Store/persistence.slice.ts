import { combineReducers } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'
import { all, put, takeLatest } from 'redux-saga/effects'

import accountSlice, { startBalancesPolling } from './account.slice'
import { initialLegacyState } from './legacy.initialState'
import { APP_PERSIST_CONFIG } from './persistence.config'

interface IRehydrate {
  key: typeof APP_PERSIST_CONFIG.key
  type: typeof REHYDRATE
}

const persistenceReducer = combineReducers({
  version: () => initialLegacyState.version,
  [accountSlice.name]: accountSlice.reducer,
})

const slice = {
  reducer: persistenceReducer,
  name: 'database',
}

export default slice

/**
 * Saga
 */
export function* persistenceSaga() {
  yield all([yield takeLatest(REHYDRATE, handleRehydrateSuccess)])
}

function* handleRehydrateSuccess(action: IRehydrate) {
  if (action.key === APP_PERSIST_CONFIG.key) {
    yield put(startBalancesPolling())
  }
}