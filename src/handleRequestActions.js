import selectActionType from './selectActionType'

export const DEFAULT_HANDLER = '@@fetch-actions/handleRequestActions/DEFAULT_HANDLER'

const isEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object

// expects either a Promise, Response, array of 2 prams or raw data to be stringified
const makeResponse = response => {
  if (typeof response.then === 'function') {
    return response.then(response => makeResponse(response))
  } else if (typeof response.json === 'function') {
    return response
  } else if (Array.isArray(response) && response.length <= 2) {
    let [data, init] = response
    // what if we're accidentally returning raw data that happens to be an array of 2 items?
    if (!!init && !isEmpty(init) && !init.status && !init.statusText && !init.headers) {
      data = response
      init = undefined
    }
    return new Response(JSON.stringify(data), init)
  } else {
    return new Response(JSON.stringify(response))
  }

const handleRequestActions = (map) => (request, action) => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    // TODO: invariant
    console.error(
      '@@fetch-actions/handleRequestActions',
      `No handler matched action.type of ${type}`,
      { request, action }
    )
    return
  }
  const response = handler(request, action)
  return makeResponse(response)
}
export default handleRequestActions
