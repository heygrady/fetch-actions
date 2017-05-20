import createFetchAction from './createFetchAction'
import handleFetchActions, { DEFAULT_HANDLER as DEFAULT_FETCH_HANDLER, makeRequest } from './handleFetchActions'
import handleRequestActions, { DEFAULT_HANDLER as DEFAULT_REQUEST_HANDLER, makeRequestResponse } from './handleRequestActions'
import handleResponseActions, { DEFAULT_HANDLER as DEFAULT_RESPONSE_HANDLER, makeResponse } from './handleResponseActions'
import handleTransformActions, { DEFAULT_TRANSFORMER, makeJson } from './handleTransformActions'
import { identityFetchHandler, identityRequestHandler, identityHandler } from './identityHandlers'

export {
  handleFetchActions, DEFAULT_FETCH_HANDLER, makeRequest,
  handleRequestActions, DEFAULT_REQUEST_HANDLER, makeRequestResponse,
  handleResponseActions, DEFAULT_RESPONSE_HANDLER, makeResponse,
  handleTransformActions, DEFAULT_TRANSFORMER, makeJson,
  identityFetchHandler, identityRequestHandler, identityHandler
}
export default createFetchAction
