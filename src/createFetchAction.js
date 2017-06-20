import { identityRequestCreator, identityHandler } from './identityHandlers'
import selectActionType from './selectActionType'
import invariant from 'invariant'
import warning from 'warning'

const createFetchAction = ({
  fetch,
  requestCreator = identityRequestCreator,
  responder,
  responseHandler = identityHandler,
  transformer = identityHandler,
  fatalHandler
} = {}) => action => {
  const type = selectActionType(action)
  invariant(type !== undefined || typeof type.toString !== 'function', '@@fetch-actions/createFetchAction action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)')
  return Promise.resolve()
    .then(() => requestCreator(action))
    .then(request => {
      if (typeof responder !== 'function' || fetch) {
        invariant(typeof fetch === 'function', '@@fetch-actions/createFetchAction fetch should be a function. createFetchAction requires either fetch or responder to be a function')
      }
      if (responder || typeof fetch !== 'function') {
        invariant(typeof responder === 'function', '@@fetch-actions/createFetchAction responder should be a function. createFetchAction requires either fetch or responder to be a function')
      }
      const response = (responder && responder(request, action))
      if (responder && !fetch) {
        invariant(response, '@@fetch-actions/createFetchAction responder must always return a valid (non-falsey) response when fetch is undefined')
      }
      return response || fetch(request)
    })
    .then(response => {
      invariant(typeof response.json === 'function', '@@fetch-actions/createFetchAction fetch or responder must always return a valid response with a json method')
      const newResponse = responseHandler(response, action)

      // TODO: is this the right assumption?
      // It could be useful to generate a simple JSON payload as a response
      // This invariant could be removed, and if raw JSON is detected, blindly pass it to transformer
      invariant(typeof newResponse.json === 'function', '@@fetch-actions/createFetchAction responseHandler must always return a valid response with a json method')
      const json = newResponse.json()
      invariant(typeof json.then === 'function', '@@fetch-actions/createFetchAction responseHandler must always return a valid response with a json method that returns a promise')
      return json
    })
    .then(json => transformer(json, action))
    .catch(error => {
      warning(!!fatalHandler, `@@fetch-actions/createFetchAction uncaught fatal error. ${error.toString()}. Define a fatalHandler to capture these in your application.`)
      if (fatalHandler) {
        return fatalHandler(error, action)
      } else {
        throw error
      }
    })
}

export default createFetchAction
