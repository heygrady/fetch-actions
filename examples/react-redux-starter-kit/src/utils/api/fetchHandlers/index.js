// import { handleRequestActions } from 'fetch-actions'
import { handleFetchActions } from '../../../../../../src'
import doubleHandler from './doubleHandler'
import { COUNTER_DOUBLE_ASYNC } from '../../../routes/Counter/modules/counter/constants'

export default handleFetchActions({
  [COUNTER_DOUBLE_ASYNC]: doubleHandler
})
