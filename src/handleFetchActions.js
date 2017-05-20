import { Request } from 'fetch-everywhere'
import selectActionType from './selectActionType'
import { identityFetchHandler } from './'

export const DEFAULT_HANDLER = '@@fetch-actions/handleFetchActions/DEFAULT_HANDLER'

// request - should be a valid fetch Request with a url method
// request - could be a thennable that returns a valid request
// request - could be a two-item array like [input, init], valid arguments for Request
// request - could be a valid input argument for Request
export const makeRequest = request => {
  if (typeof request.then === 'function') {
    return request.then(request => makeRequest(request))
  } else if (typeof request.url === 'function') {
    return request
  } else if (Array.isArray(request) && request.length === 2) {
    let [input, init] = request
    return new Request(input, init)
  } else {
    return new Request(request)
  }
}

const handleFetchActions = map => action => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    // TODO: invariant
    console.warn(
      '@@fetch-actions/handleFetchActions',
      `No handler matched action.type of ${type}`,
      { map, action }
    )
    return identityFetchHandler()
  }
  return makeRequest(handler(action))
}
export default handleFetchActions
