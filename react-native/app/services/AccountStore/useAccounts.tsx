import { useSelector } from 'react-redux'

import {
  getAccount,
  createAccount as createAccountRedux,
  updateAccount as updateAccountRedux,
} from '@app/services/Store/account.slice'
import { useDispatch } from '@app/services/Store'
import { StoreAccount } from '@app/types'

export interface IAccountContext {
  account: StoreAccount
  updateAccount(accountData: StoreAccount): void
}

function useAccounts() {
  const account = useSelector(getAccount)
  const dispatch = useDispatch()
  const createAccount = (account: StoreAccount) =>
    dispatch(createAccountRedux(account))

  const updateAccount = (account: StoreAccount) =>
    dispatch(updateAccountRedux(account))
  return {
    account,
    createAccount,
    updateAccount,
  }
}

export default useAccounts
