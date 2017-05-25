import { identityFetchHandler, identityHandler } from './identityHandlers'
import selectActionType from './selectActionType'
import invariant from 'invariant'

const createFetchAction = ({
  fetch,
  fetchHandler = identityFetchHandler,
  requestHandler,
  responseHandler = identityHandler,
  transformer = identityHandler
} = {}) => action => {
  const type = selectActionType(action)
  invariant(type !== undefined, '@@fetch-actions/createFetchAction action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)')
  return Promise.resolve()
    .then(() => fetchHandler(action))
    .then(request => {
      if (typeof requestHandler !== 'function' || fetch) {
        invariant(typeof fetch === 'function', '@@fetch-actions/createFetchAction fetch should be a function. createFetchAction requires either fetch or requestHandler to be a function')
      }
      if (requestHandler || typeof fetch !== 'function') {
        invariant(typeof requestHandler === 'function', '@@fetch-actions/createFetchAction requestHandler should be a function. createFetchAction requires either fetch or requestHandler to be a function')
      }
      const response = (requestHandler && requestHandler(request, action))
      if (requestHandler && !fetch) {
        invariant(response, '@@fetch-actions/createFetchAction requestHandler must always return a valid (non-falsey) response when fetch is undefined')
      }
      return response || fetch(request)
    })
    .then(response => {
      invariant(typeof response.json === 'function', '@@fetch-actions/createFetchAction fetch or requestHandler must always return a valid response with a json method')
      const newResponse = responseHandler(response, action)
      invariant(typeof newResponse.json === 'function', '@@fetch-actions/createFetchAction responseHandler must always return a valid response with a json method')
      const json = newResponse.json()
      invariant(typeof json.then === 'function', '@@fetch-actions/createFetchAction responseHandler must always return a valid response with a json method that returns a promise')
      return json
    })
    .then(json => transformer(json, action))
}

export default createFetchAction
