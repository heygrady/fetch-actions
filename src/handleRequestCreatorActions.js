import selectActionType from './selectActionType'
import { identityRequestCreator } from './identityHandlers'
import invariant from 'invariant'
import warning from 'warning'

export const DEFAULT_HANDLER = '@@fetch-actions/handleRequestCreatorActions/DEFAULT_HANDLER'

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

const handleRequestCreatorActions = map => action => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  invariant(type !== undefined, '@@fetch-actions/handleRequestCreatorActions action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)')
  invariant(map, '@@fetch-actions/handleRequestCreatorActions map must be defined')
  if (!handler) {
    warning(handler, `@@fetch-actions/handleRequestCreatorActions No handler matched action.type of ${type}. Using identityRequestCreator which simply returns an empty request.`)
    return identityRequestCreator()
  }
  return makeRequest(handler(action))
}
export default handleRequestCreatorActions
