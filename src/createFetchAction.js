import { identityFetchHandler, identityHandler } from './identityHandlers'

const createFetchAction = ({
  fetch,
  fetchHandler = identityFetchHandler,
  requestHandler,
  responseHandler = identityHandler,
  transformer = identityHandler
}) => action => Promise.resolve()
  .then(() => fetchHandler(action))
  .then(request => (requestHandler && requestHandler(request, action)) || fetch(request))
  .then(response => responseHandler(response, action))
  .then(response => response.json())
  .then(json => transformer(json, action))

export default createFetchAction
