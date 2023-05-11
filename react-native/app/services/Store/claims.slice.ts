import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { all, select, takeLatest } from 'redux-saga/effects'

import { Claim, LocalStoreKeys } from '@app/types'
import { getAppState } from './selectors'

export const initialState = {} as any

const sliceName = LocalStoreKeys.CLAIMS

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(_, action: PayloadAction<Claim>) {
      return action.payload
    },
    update(state, action: PayloadAction<Claim>) {
      return { ...state, ...action.payload }
    },
    reset() {
      return initialState
    },
  },
})

export const {
  create: createClaim,
  update: updateClaim,
  reset: destroyClaim,
} = slice.actions

export default slice

/**
 * Selectors
 */
export const getClaim = createSelector([getAppState], (s) => {
  return s[LocalStoreKeys.CLAIMS]
})

/**
 * Actions
 */
export const doClaim = createAction(`${slice.name}/doClaim`)

/**
 * Sagas
 */
export function* claimsSaga() {
  yield all([takeLatest(doClaim.type, handleDoClaim)])
}

export function* handleDoClaim() {
  const claim = yield select(getClaim)
  console.debug(
    `[handleDoClaim]: @todo: something here with claim ${JSON.stringify(
      claim,
    )}`,
  )
}
