import { AnyAction, combineReducers } from '@reduxjs/toolkit'

import persistenceSlice from './persistence.slice'
import { createPersistReducer } from './persistence.config'

const reducers = combineReducers({
  [persistenceSlice.name as 'database']: createPersistReducer(
    persistenceSlice.reducer,
  ),
})

const rootReducer = (
  state = reducers(undefined, { type: '' }),
  action: AnyAction,
) => {
  switch (action.type) {
    default: {
      return reducers(state, action)
    }
  }
}

export default rootReducer

export type AppState = ReturnType<typeof rootReducer>
