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
export const appReset = createAction(
  'app/Reset',
  (newDb = initialLegacyState) => ({
    payload: newDb,
  }),
)

const rootReducer = (state = undefined, action: AnyAction) => {
  switch (action.type) {
    case appReset.type: {
      return {
        ...state,
        [persistenceSlice.name]: {
          ...action.payload,
          _persist: state.database._persist,
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
