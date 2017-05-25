import selectActionType from './selectActionType'
import { identityFetchHandler } from './identityHandlers'
import invariant from 'invariant'
import warning from 'warning'

export const DEFAULT_HANDLER = '@@fetch-actions/handleFetchActions/DEFAULT_HANDLER'

export const makeRequest = request => {
  if (typeof request.then === 'function') {
    return request.then(request => makeRequest(request))
  } else if (typeof request.url === 'string') {
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
  invariant(type !== undefined, '@@fetch-actions/handleFetchActions action type must be defined')
  invariant(map, '@@fetch-actions/handleFetchActions map must be defined')
  if (!handler) {
    // TODO: invariant
    warning(handler, `@@fetch-actions/handleResponseActions No handler matched action.type of ${type}. Using identityFetchHandler which simply returns an.`)
    return identityFetchHandler()
  }
  return makeRequest(handler(action))
}
export default handleFetchActions
