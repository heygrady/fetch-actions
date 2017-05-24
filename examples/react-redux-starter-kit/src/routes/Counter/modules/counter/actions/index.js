import { COUNTER_INCREMENT, COUNTER_DOUBLE_ASYNC, LOAD_COUNTER } from '../constants'

// ------------------------------------
// Actions
// ------------------------------------
export function increment (value = 1) {
  return {
    type    : COUNTER_INCREMENT,
    payload : value
  }
}

export function load (value) {
  return {
    type    : LOAD_COUNTER,
    payload : value
  }
}

export function doubleAsync () {
  return {
    type    : COUNTER_DOUBLE_ASYNC,
    payload : undefined
  }
}
