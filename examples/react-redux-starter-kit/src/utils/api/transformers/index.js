import { handleTransformerActions } from '../../../../../../src'
import doubleHandler from './doubleTransformer'
import { COUNTER_DOUBLE_ASYNC } from '../../../routes/Counter/modules/counter/constants'

export default handleTransformerActions({
  [COUNTER_DOUBLE_ASYNC]: doubleHandler
})
