import { combineReducers } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'
import { all, put, takeLatest } from 'redux-saga/effects'

import { accountSlice, startBalancesPolling } from './account.slice'
import { initialLegacyState } from './legacy.initialState'
import { APP_PERSIST_CONFIG } from './persistence.config'
//import { appReset } from './root.reducer'

interface IRehydrate {
  key: typeof APP_PERSIST_CONFIG.key
  type: typeof REHYDRATE
}
console.debug('[persistence.slice.ts]', JSON.stringify(accountSlice))
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
  yield all([
    takeLatest(REHYDRATE, handleRehydrateSuccess),
    takeLatest((action) => {
      console.debug(action.type, /persist/.test(action.type))
      return /persist/.test(action.type)
    }, handlePersist),

    //takeLatest(appReset.type, handleAppReset),
  ])
}

// function* handleAppReset() {
//   yield put({type: 'persist/PURGE', key: APP_PERSIST_CONFIG.key}})
// }

function* handlePersist(action: any) {
  console.debug('[handlePersist]', JSON.stringify(action))
}

function* handleRehydrateSuccess(action: IRehydrate) {
  console.debug(`[handleRehydrateSuccess]: ${JSON.stringify(action)}`)
  if (action.key === APP_PERSIST_CONFIG.key) {
    yield put(startBalancesPolling())
  }
}
