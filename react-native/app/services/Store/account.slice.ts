import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { isEmpty } from 'lodash'

import {
  AccountType,
  ContractStoreAccount,
  EOAStoreAccount,
  ExtendedTxResponse,
  ITxStatus,
  ITxType,
  LocalStoreKeys,
  StoreAccount,
} from '@app/types'

import { getAppState } from './selectors'
import { IPollingPayload, pollingSaga } from '../Polling'
import { getBalances } from '../BalanceService'
import { ProviderHandler } from '../EthService'
import { LINEA_NETWORK_CONFIG } from '@app/constants'

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
export const selectAccountTxs = createSelector(
  [getAccount],
  (account) => account.transactions,
)

export const selectTxsByStatus = (status: ITxStatus) =>
  createSelector([selectAccountTxs], (txs) => {
    return Object.values(txs).filter(({ txStatus: s }) => s === status)
  })

export const removeAccountTx = createAction<{
  txHash: string
}>(`${slice.name}/removeAccountTx`)

export const startTxPolling = createAction(`${slice.name}/startTxPolling`)
export const stopTxPolling = createAction(`${slice.name}/stopTxPolling`)

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
    takeLatest(removeAccountTx.type, removeAccountTxWorker),
    pollingSaga(pendingTxPollingPayload),
    pollingSaga(balancesPollingPayload),
  ])
}

export function* removeAccountTxWorker({
  payload: { txHash },
}: PayloadAction<{
  account: StoreAccount
  txHash: string
}>) {
  const account: StoreAccount = yield select(getAccount)
  if (isEmpty(account)) return
  const newAccountData = {
    ...account,
    transactions: Object.values(account.transactions).reduce((acc, curTx) => {
      if (curTx.hash !== txHash) {
        acc[txHash] = curTx
      }
      return acc
    }, {}),
  }
  yield put(updateAccount(newAccountData))
}

// Polling Config
const pendingTxPollingPayload: IPollingPayload = {
  startAction: startTxPolling,
  stopAction: stopTxPolling,
  params: {
    interval: 5000,
    retryOnFailure: true,
    retries: 3,
    retryAfter: 3000,
  },
  saga: pendingTxPolling,
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

export function* pendingTxPolling() {
  console.debug(`[pendingTxPolling]: started.`)

  const pendingTransactions: ExtendedTxResponse[] = yield select(
    selectTxsByStatus(ITxStatus.PENDING),
  )
  console.debug(
    `[pendingTxPolling]: started.${JSON.stringify(pendingTransactions)}`,
  )
  const account: StoreAccount = yield select(getAccount)
  if (account.type === AccountType.VIEW_ONLY) return
  const network = LINEA_NETWORK_CONFIG

  for (const pendingTx of pendingTransactions) {
    // If network is not found in the pendingTransactionObject, we cannot continue.
    if (!network) continue
    console.debug(`[pendingTxPolling]: started rotation`)
    const provider = new ProviderHandler(network)

    // Special notation for calling class functions that reference `this`
    const txResponse = yield call(
      [provider, provider.getTransactionReceipt],
      pendingTx.hash,
    )
    // Fail out if tx receipt cant be found.
    // This initial check stops us from spamming node for data before there is data to fetch.
    // This occurs when tx is pending
    if (!txResponse || !txResponse.blockNumber) {
      const transactionCount = yield call(
        [provider, provider.getTransactionCount],
        pendingTx.from,
      )
      console.debug(
        transactionCount,
        pendingTx.nonce,
        transactionCount > pendingTx.nonce,
      )
      // If transaction count > pendingTx nonce, then the nonce has been used already
      // (i.e - tx may have been overwritten somewhere other than in-app)
      if (transactionCount >= pendingTx.nonce) {
        yield put(
          removeAccountTx({
            txHash: pendingTx.hash,
          }),
        )
      }
      continue
    }

    const txStatus =
      txResponse.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED
    const { timestamp: txTimestamp } = yield call(
      [provider, provider.getBlockByNumber],
      txResponse.blockNumber,
    )

    // Get block tx success/fail and timestamp for block number, then overwrite existing tx in account.
    // txStatus and txTimestamp return undefined on failed lookups.
    if (!txStatus || !txTimestamp) continue

    const isDeploySmartAccount =
      pendingTx.txType === ITxType.DEPLOY_SMART_ACCOUNT

    const isNowContractAccount =
      isDeploySmartAccount && account.type === AccountType.EOA

    const deriveContractAddress = (isNowContractAccount, pendingTx) =>
      isNowContractAccount ? pendingTx.contractAddress : undefined

    const deriveNewPendingContractAddr = (
      account: EOAStoreAccount | ContractStoreAccount,
      newAccountType: AccountType,
    ) => {
      if (newAccountType == AccountType.EOA) {
        return account.pendingContractAddress
      }
      return undefined
    }

    const deriveNewAccountType = (
      isNowContractAccount: boolean,
      account: EOAStoreAccount | ContractStoreAccount,
    ) => {
      return isNowContractAccount ? AccountType.CONTRACT : account.type
    }
    const newAccountType = deriveNewAccountType(isNowContractAccount, account)
    const newAccountData = {
      ...account,
      type: newAccountType,
      contractAddress: deriveContractAddress(isNowContractAccount, pendingTx),
      pendingContractAddress: deriveNewPendingContractAddr(
        account,
        newAccountType,
      ),
      transactions: Object.values(account.transactions).reduce((acc, curTx) => {
        if (curTx.hash !== pendingTx.hash) {
          acc[curTx.hash] = curTx
        } else {
          acc[curTx.hash] = {
            ...curTx,
            txStatus,
          }
        }
        return acc
      }, {}),
    }
    yield put(updateAccount(newAccountData))
  }
}
