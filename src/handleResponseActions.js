import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

import { identityHandler } from './identityHandlers'
import { selectActionType } from './selectActionType'

export const DEFAULT_HANDLER =
  '@@fetch-actions/handleResponseActions/DEFAULT_HANDLER'

//  handle thenables and Response objects
export const makeResponse = (response) => {
  if (typeof response.then === 'function') {
    return response.then((response) => makeResponse(response))
  } else if (typeof response.json === 'function') {
    return response
  } else {
    warning(
      undefined,
      '@@fetch-actions/handleResponseActions/makeResponse undefined response object. response must have a json method that returns json or be a thennable that returns a response with a json method'
    )
    return undefined
  }
}

export const handleResponseActions = (map) => (response, action) => {
  const type = selectActionType(action)
  invariant(
    type !== undefined,
    '@@fetch-actions/handleResponseActions action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)'
  )
  invariant(map, '@@fetch-actions/handleResponseActions map must be defined')
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    warning(
      handler,
      `@@fetch-actions/handleResponseActions No handler matched action.type of ${type}. Using identityHandler which simply returns the response unchanged.`
    )
    return identityHandler(response, action)
  }
  return makeResponse(handler(response, action))
}
