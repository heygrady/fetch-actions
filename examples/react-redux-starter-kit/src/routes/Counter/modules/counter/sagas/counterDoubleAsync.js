import { select, call, put } from 'redux-saga/effects'
import fetchAction from '../../../../../utils/api'
import { load } from '../actions'

export default function * (action) {
  const value = yield select(state => state.counter)
  const newAction = { ...action, payload: value }
  const counter = yield call(fetchAction, newAction)
  if (counter || counter === 0) {
    yield put(load(counter))
  }
}
