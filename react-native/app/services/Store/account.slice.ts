import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { isEmpty } from 'lodash'

import { LocalStoreKeys, StoreAccount } from '@app/types'

import { getAppState } from './selectors'
import { IPollingPayload, pollingSaga } from '../Polling'
import { getBalances } from '../BalanceService'

export const initialState = {} as any

const sliceName = LocalStoreKeys.ACCOUNTS

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(_, action: PayloadAction<StoreAccount>) {
      return action.payload
    },
    update(state, action: PayloadAction<StoreAccount>) {
      return { ...state, ...action.payload }
    },
    reset() {
      return initialState
    },
  },
})

export const {
  create: createAccount,
  update: updateAccount,
  reset: resetAccount,
} = slice.actions

export default slice

/**
 * Selectors
 */
export const getAccount = createSelector([getAppState], (s) => {
  return s[LocalStoreKeys.ACCOUNTS]
})

export const startBalancesPolling = createAction(
  `${slice.name}/startBalancesPolling`,
)
export const stopBalancesPolling = createAction(
  `${slice.name}/stopBalancesPolling`,
)

/**
 * Sagas
 */
export function* accountsSaga() {
  yield all([
    takeLatest(createAccount.type, fetchBalances),
    pollingSaga(balancesPollingPayload),
  ])
}

const balancesPollingPayload: IPollingPayload = {
  startAction: startBalancesPolling,
  stopAction: stopBalancesPolling,
  params: {
    interval: 10 * 1000,
    retryOnFailure: true,
    retries: 1,
    retryAfter: 10 * 1000,
  },
  saga: fetchBalances,
}

// @todo: if we want this to be more than just USDC, we'll need to
// add new field to the StoreAccount type and update the
export function* fetchBalances() {
  const account: StoreAccount = yield select(getAccount)
  if (isEmpty(account)) return
  const accountsWithBalances: StoreAccount = yield call(getBalances, account)

  yield put(updateAccount(accountsWithBalances))
}
