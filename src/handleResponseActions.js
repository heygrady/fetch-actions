import selectActionType from './selectActionType'
import { identityHandler } from './'

export const DEFAULT_HANDLER = '@@fetch-actions/handleResponseActions/DEFAULT_HANDLER'

//  handle thenables and Response objects
export const makeResponse = response => {
  if (typeof response.then === 'function') {
    return response.then(response => makeResponse(response))
  } else if (typeof response.json === 'function') {
    return response
  } else {
    // TODO: invariant
    console.warn(
      '@@fetch-actions/handleResponseActions { makeResponse }',
      `undefined response object. response must have a json method that returns json or be a thennable that returns a response with a json method`,
      { response }
    )
    return undefined
  }
}

const handleResponseActions = (map) => (response, action) => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    // TODO: invariant
    console.warn(
      '@@fetch-actions/handleResponseActions',
      `No handler matched action.type of ${type}`,
      { map, response, action }
    )
    return identityHandler(response, action)
  }
  return makeResponse(handler(response, action))
}
export default handleResponseActions
