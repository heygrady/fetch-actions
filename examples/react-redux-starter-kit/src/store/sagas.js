import { all, fork } from 'redux-saga/effects'
import sagaMiddleware, { runSaga, injectSaga, cancelTask } from 'redux-saga-watch-actions/lib/middleware'
import counter from '../routes/Counter/modules/counter/sagas'

const rootSaga = function * () {
  yield all([
    fork(counter)
  ])
}

export { runSaga, sagaMiddleware, injectSaga, cancelTask }
export default rootSaga
