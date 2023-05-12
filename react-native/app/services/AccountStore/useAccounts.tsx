import { useSelector } from 'react-redux'

import {
  getAccount,
  createAccount as createAccountRedux,
  updateAccount as updateAccountRedux,
  resetAccount as resetAccountRedux,
} from '@app/services/Store/account.slice'
import { useDispatch } from '@app/services/Store'
import { ExtendedTxResponse, StoreAccount } from '@app/types'

export interface IAccountContext {
  account: StoreAccount
  updateAccount(accountData: StoreAccount): void
  createAccount(accountData: StoreAccount): void
  resetAccount(): void
}

function useAccounts() {
  const account = useSelector(getAccount)
  const dispatch = useDispatch()
  const createAccount = (account: StoreAccount) =>
    dispatch(createAccountRedux(account))

  const updateAccount = (account: StoreAccount) =>
    dispatch(updateAccountRedux(account))

  const addTxToAccount = (account: StoreAccount, tx: ExtendedTxResponse) =>
    dispatch(
      updateAccountRedux({
        ...account,
        transactions: {
          ...account.transactions,
          [tx.hash]: { ...account.transactions[tx.hash], ...tx },
        },
      }),
    )

  const resetAccount = () => dispatch(resetAccountRedux())
  return {
    account,
    createAccount,
    addTxToAccount,
    updateAccount,
    resetAccount,
  }
}

export default useAccounts
