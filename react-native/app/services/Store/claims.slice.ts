import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { all, select, takeLatest } from 'redux-saga/effects'

import { Claim, ClaimTo, LocalStoreKeys } from '@app/types'
import { getAppState } from './selectors'

export const initialState = {} as Record<string, Claim>

const sliceName = LocalStoreKeys.CLAIMS

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<{ id: string; claim: Claim }>) {
      state[action.payload.id] = { ...action.payload.claim }
      return state
    },
    update(state, action: PayloadAction<{ id: string; claim: Claim }>) {
      state[action.payload.id] = { ...action.payload.claim }
      return state
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
export const getClaims = createSelector([getAppState], (s) => {
  return Object.values(s[LocalStoreKeys.CLAIMS]).reduce<Claim[]>(
    (acc, cur: Claim) => {
      if (cur.to === ClaimTo.ME) {
        acc.push(cur)
      }
      return acc
    },
    [],
  )
})

export const getInvites = createSelector([getAppState], (s) => {
  return Object.values(s[LocalStoreKeys.CLAIMS]).reduce<Claim[]>(
    (acc, cur: Claim) => {
      if (cur.to === ClaimTo.OTHER) {
        acc.push(cur)
      }
      return acc
    },
    [],
  )
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
  const claim = yield select(getClaims)
  console.debug(
    `[handleDoClaim]: @todo: something here with claim ${JSON.stringify(
      claim,
    )}`,
  )
}
