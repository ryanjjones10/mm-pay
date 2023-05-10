import { all } from 'redux-saga/effects'

import { accountsSaga } from './account.slice'
import { persistenceSaga } from './persistence.slice'

export default function* rootSaga() {
  yield all([persistenceSaga(), accountsSaga()])
}
