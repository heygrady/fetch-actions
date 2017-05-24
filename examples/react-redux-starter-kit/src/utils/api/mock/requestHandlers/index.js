// import { handleRequestActions } from 'fetch-actions'
import { handleRequestActions } from '../../../../../../../src'
import doubleHandler from './doubleHandler'
import { COUNTER_DOUBLE_ASYNC } from '../../../../routes/Counter/modules/counter/constants'

export default handleRequestActions({
  [COUNTER_DOUBLE_ASYNC]: doubleHandler
})
