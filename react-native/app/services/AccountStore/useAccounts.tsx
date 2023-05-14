import { useSelector } from 'react-redux'
import { Wallet } from '@ethersproject/wallet'

import {
  getAccount,
  createAccount as createAccountRedux,
  updateAccount as updateAccountRedux,
  resetAccount as resetAccountRedux,
} from '@app/services/Store/account.slice'
import {
  updateClaim as updateClaimRedux,
  createClaim as createClaimRedux,
} from '@app/services/Store/claims.slice'
import { useDispatch } from '@app/services/Store'
import {
  AccountType,
  Claim,
  ClaimStruct,
  ClaimTo,
  EOAStoreAccount,
  ExtendedTxResponse,
  StoreAccount,
} from '@app/types'
import { generateUUID } from '@app/utils'
import { LINEA_TESTNET_CHAINID } from '@app/constants'

export interface IAccountContext {
  account: StoreAccount
  updateAccount(accountData: StoreAccount): void
  createAccount(accountData: StoreAccount): void
  addNewUserFromClaim(claim: ClaimStruct): void
  upgradeAccountToContract(account: EOAStoreAccount, claim: Claim): void
  resetAccount(): void
}

function useAccounts() {
  const account = useSelector(getAccount)
  const dispatch = useDispatch()
  const createAccount = (account: StoreAccount) =>
    dispatch(createAccountRedux(account))

  const updateAccount = (account: StoreAccount) =>
    dispatch(updateAccountRedux(account))

  const addNewUserFromClaim = (claim: ClaimStruct) => {
    console.debug('[addNewUserFromClaim]: ', claim)
    return (dispatch) => {
      dispatch(
        createAccountRedux({
          privateKey: claim.privateKey,
          type: AccountType.EOA,
          address: new Wallet(claim.privateKey).address,
          usdcBalance: '0',
          usdcRate: 1,
          nativeBalance: '0',
          nativeRate: 2000,
          chainId: LINEA_TESTNET_CHAINID,
          transactions: {},
        } as EOAStoreAccount),
      )
      dispatch(
        createClaimRedux({
          id: generateUUID(claim.privateKey),
          claim: {
            data: claim,
            to: ClaimTo.ME,
            used: false,
            id: generateUUID(claim.privateKey),
          },
        }),
      )
    }
  }

  const upgradeAccountToContract = (account: EOAStoreAccount, claim: Claim) =>
    dispatch(
      updateAccountRedux({
        ...account,
        type: AccountType.CONTRACT,
        contractAddress: claim.data.contractAddress,
      }),
    )
  // @todo: re-add dispatch below when claim functionality is working as intended.
  //   dispatch(
  //     updateClaimRedux({ id: claim.id, claim: { ...claim, used: true } }),
  //   )

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
    upgradeAccountToContract,
    addNewUserFromClaim,
    updateAccount,
    resetAccount,
  }
}

export default useAccounts
