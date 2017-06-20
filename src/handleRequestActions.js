import selectActionType from './selectActionType'
import { identityResponder } from './identityHandlers'
import invariant from 'invariant'
import warning from 'warning'

export const DEFAULT_HANDLER = '@@fetch-actions/handleRespondorActions/DEFAULT_HANDLER'

const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

const maybeStringify = body => {
  // TODO: don't stringify in some specific cases
  return JSON.stringify(body)
}

export const makeResponse = response => {
  if (typeof response.then === 'function') {
    return response.then(response => makeResponse(response))
  } else if (typeof response.json === 'function') {
    return response
  } else if (Array.isArray(response) && response.length === 2) {
    let [body, init] = response
    // TODO: what if we're accidentally returning a raw body that happens to be an array of 2 items?
    if (!!init && !isEmpty(init) && !init.status && !init.statusText && !init.headers) {
      body = response
      init = undefined
    }
    return new Response(maybeStringify(body), init)
  } else {
    return new Response(maybeStringify(response))
  }
}

const handleRespondorActions = (map) => (request, action) => {
  const type = selectActionType(action)
  invariant(type !== undefined, '@@fetch-actions/handleRespondorActions action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)')
  invariant(map, '@@fetch-actions/handleRespondorActions map must be defined')
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    warning(handler, `@@fetch-actions/handleResponseActions No handler matched action.type of ${type}. Using identityResponder which simply returns undefined.`)
    return identityResponder()
  }
  const response = handler(request, action)
  return makeResponse(response)
}
export default handleRespondorActions
