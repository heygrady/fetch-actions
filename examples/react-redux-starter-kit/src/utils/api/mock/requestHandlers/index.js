import { handleResponderActions } from '../../../../../../../src'
import doubleHandler from './doubleHandler'
import { COUNTER_DOUBLE_ASYNC } from '../../../../routes/Counter/modules/counter/constants'

export default handleResponderActions({
  [COUNTER_DOUBLE_ASYNC]: doubleHandler
})
