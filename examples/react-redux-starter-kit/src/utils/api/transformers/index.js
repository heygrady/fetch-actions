// import { handleRequestActions } from 'fetch-actions'
import { handleTransformActions } from '../../../../../../src'
import doubleHandler from './doubleTransformer'
import { COUNTER_DOUBLE_ASYNC } from '../../../routes/Counter/modules/counter/constants'

export default handleTransformActions({
  [COUNTER_DOUBLE_ASYNC]: doubleHandler
})
