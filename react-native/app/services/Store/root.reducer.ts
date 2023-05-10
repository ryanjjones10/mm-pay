import { AnyAction, combineReducers, createAction } from '@reduxjs/toolkit'

import { initialLegacyState } from './legacy.initialState'
import persistenceSlice from './persistence.slice'
import { createPersistReducer } from './persistence.config'

const reducers = combineReducers({
  [persistenceSlice.name as 'database']: createPersistReducer(
    persistenceSlice.reducer,
  ),
})

/**
 * Actions
 */
export const appReset = createAction('app/Reset', () => ({
  payload: initialLegacyState,
}))

const rootReducer = (
  state = reducers(undefined, { type: '' }),
  action: AnyAction,
) => {
  console.debug(`[rootReducer]: ${action.type}`, JSON.stringify(action.payload))
  switch (action.type) {
    case appReset.type: {
      const z = {
        ...state,
        [persistenceSlice.name]: {
          ...action.payload,
          ...{ _persist: state.database._persist },
        },
      }
      //dispatch
      console.debug('z', z)
      state = {
        ...state,
        [persistenceSlice.name]: {
          ...action.payload,
          ...{ _persist: state.database._persist },
        },
      }
    }

    default: {
      return reducers(state, action)
    }
  }
}

export default rootReducer

export type AppState = ReturnType<typeof rootReducer>
