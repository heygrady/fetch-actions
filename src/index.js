export const IDENTITY_FETCH_HANDLER_WARNING = '@@fetch-actions/IDENTITY_FETCH_HANDLER_WARNING'

export const identityFetchHandler = (payload, action) => {
  console.warn(IDENTITY_FETCH_HANDLER_WARNING)
  return new Request()
}
export const identityRequestHandler = (payload, action) => false
export const identityHandler = (payload, action) => payload


const createFetchAction = ({
  fetch,
  fetchHandler = identityFetchHandler,
  requestHandler = identityRequestHandler,
  responseHandler = identityHandler,
  transformer = identityHandler
}) => action => Promise.resolve()
  .then(() => fetchHandler(action))
  .then(request => requestHandler && requestHandler(request, action) || fetch(request))
  .then(response => responseHandler(response, action))
  .then(response => response.json())
  .then(json => transformer(json, action))

  export default createFetchAction
