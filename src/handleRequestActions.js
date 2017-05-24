// import { Response } from 'fetch-everywhere'
import selectActionType from './selectActionType'
import { identityRequestHandler } from './identityHandlers'

export const DEFAULT_HANDLER = '@@fetch-actions/handleRequestActions/DEFAULT_HANDLER'

const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

const maybeStringify = body => {
  // TODO: don't stringify in some specific cases
  return JSON.stringify(body)
}

// expects either a Promise, Response, array of 2 prams or raw data to be stringified
// promise - expects the promise to return a valid response for makeResponse
// response - expects the response to be a valid fetch Response with a json method
// response = [body, init] expect array to be valid arguments for Response and maybeStringify
// response - expects response to be a maybeStringify compatible body.
export const makeResponse = response => {
  if (typeof response.then === 'function') {
    return response.then(response => makeResponse(response))
  } else if (typeof response.json === 'function') {
    return response
  } else if (Array.isArray(response) && response.length === 2) {
    let [body, init] = response
    // what if we're accidentally returning a raw body that happens to be an array of 2 items?
    if (!!init && !isEmpty(init) && !init.status && !init.statusText && !init.headers) {
      body = response
      init = undefined
    }
    return new Response(maybeStringify(body), init)
  } else {
    return new Response(maybeStringify(response))
  }
}

const handleRequestActions = (map) => (request, action) => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    // TODO: invariant
    console.warn(
      '@@fetch-actions/handleRequestActions',
      `No handler matched action.type of ${type}`,
      { map, request, action }
    )
    return identityRequestHandler()
  }
  const response = handler(request, action)
  return makeResponse(response)
}
export default handleRequestActions
