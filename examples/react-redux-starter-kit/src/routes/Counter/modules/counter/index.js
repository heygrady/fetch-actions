import rootSaga from './sagas'
import { increment, doubleAsync, load } from './actions'
import { COUNTER_INCREMENT, COUNTER_DOUBLE_ASYNC, LOAD_COUNTER } from './constants'

// NOTE: moved constants and actions to separate files to avoid circular reference issues

export const actions = {
  increment,
  doubleAsync,
  load
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT]    : (state, action) => state + action.payload,
  [LOAD_COUNTER]         : (state, action) => action.payload
}

// ------------------------------------
// Root Saga
// ------------------------------------
export {
  rootSaga,
  COUNTER_INCREMENT, COUNTER_DOUBLE_ASYNC, LOAD_COUNTER,
  increment, doubleAsync, load }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 0
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
