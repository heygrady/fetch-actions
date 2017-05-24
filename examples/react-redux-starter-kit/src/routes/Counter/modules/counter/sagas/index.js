import { watchActions } from 'redux-saga-watch-actions/lib'
import { COUNTER_DOUBLE_ASYNC } from '../constants'
import counterDoubleAsync from './counterDoubleAsync'

export const butter = 'beans'

const rootSaga = watchActions({
  [COUNTER_DOUBLE_ASYNC]: counterDoubleAsync
})
export default rootSaga
