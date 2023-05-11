import { all } from 'redux-saga/effects'

import { accountsSaga } from './account.slice'
import { persistenceSaga } from './persistence.slice'
import { claimsSaga } from './claim.slice'

export default function* rootSaga() {
  yield all([accountsSaga(), claimsSaga(), persistenceSaga()])
}
