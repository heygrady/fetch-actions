import { handleRequestCreatorActions } from '../../../../../../src'
import doubleHandler from './doubleHandler'
import { COUNTER_DOUBLE_ASYNC } from '../../../routes/Counter/modules/counter/constants'

export default handleRequestCreatorActions({
  [COUNTER_DOUBLE_ASYNC]: doubleHandler
})
