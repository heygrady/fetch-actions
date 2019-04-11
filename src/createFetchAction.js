import { identityRequestCreator, identityHandler } from './identityHandlers'
import selectActionType from './selectActionType'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

const createFetchAction = ({
  fetch,
  requestCreator = identityRequestCreator,
  responder,
  responseHandler = identityHandler,
  transformer = identityHandler,
  fatalHandler,
} = {}) => async (action) => {
  const type = selectActionType(action)
  invariant(
    type !== undefined || typeof type.toString !== 'function',
    '@@fetch-actions/createFetchAction action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)'
  )
  try {
    const request = await requestCreator(action)
    let response
    if (typeof responder !== 'function' || fetch) {
      invariant(
        typeof fetch === 'function',
        '@@fetch-actions/createFetchAction fetch should be a function. createFetchAction requires either fetch or responder to be a function'
      )
    }
    if (responder || typeof fetch !== 'function') {
      invariant(
        typeof responder === 'function',
        '@@fetch-actions/createFetchAction responder should be a function. createFetchAction requires either fetch or responder to be a function'
      )
    }
    if (responder) {
      response = await responder(request, action)
    }
    if (responder && !fetch) {
      invariant(
        response,
        '@@fetch-actions/createFetchAction responder must always return a valid (non-falsey) response when fetch is undefined'
      )
    }
    if (!response) {
      response = await fetch(request)
    }
    invariant(
      typeof response.json === 'function',
      '@@fetch-actions/createFetchAction fetch or responder must always return a valid response with a json method'
    )
    const newResponse = await responseHandler(response, action)
    // TODO: is this the right assumption?
    // It could be useful to generate a simple JSON payload as a response
    // This invariant could be removed, and if raw JSON is detected, blindly pass it to transformer
    invariant(
      typeof newResponse.json === 'function',
      '@@fetch-actions/createFetchAction responseHandler must always return a valid response with a json method'
    )
    const data = await newResponse.json()
    const result = await transformer(data, action)
    return result
  } catch (error) {
    warning(
      !!fatalHandler,
      `@@fetch-actions/createFetchAction uncaught fatal error. ${error.toString()}. Define a fatalHandler to capture these in your application.`
    )
    let result
    if (fatalHandler) {
      result = await fatalHandler(error, action)
    }
    if (result !== undefined) {
      return result
    }
    throw error
  }
}

export default createFetchAction
