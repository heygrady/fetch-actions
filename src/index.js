import createFetchAction from './createFetchAction'
import handleFetchActions, { DEFAULT_HANDLER as DEFAULT_FETCH_HANDLER, makeRequest } from './handleFetchActions'
import handleRequestActions, { DEFAULT_HANDLER as DEFAULT_REQUEST_HANDLER, makeResponse as makeRequestResponse } from './handleRequestActions'
import handleResponseActions, { DEFAULT_HANDLER as DEFAULT_RESPONSE_HANDLER, makeResponse } from './handleResponseActions'
import handleTransformActions, { DEFAULT_TRANSFORMER, makeJson } from './handleTransformActions'
import reduceHandlers, { someFetchHandlers, someRequestHandlers } from './reduceHandlers'
import { identityFetchHandler, identityRequestHandler, identityHandler } from './identityHandlers'
import warning from 'warning'

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed () {}

if (
  process.env.NODE_ENV !== 'production' &&
  typeof isCrushed.name === 'string' &&
  isCrushed.name !== 'isCrushed'
) {
  warning(true,
    'You are currently using minified code outside of NODE_ENV === \'production\'. ' +
    'This means that you are running a slower development build of FetchActions. ' +
    'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
    'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' +
    'to ensure you have the correct code for your production build.'
  )
}

export {
  createFetchAction,
  handleFetchActions, DEFAULT_FETCH_HANDLER, makeRequest,
  handleRequestActions, DEFAULT_REQUEST_HANDLER, makeRequestResponse,
  handleResponseActions, DEFAULT_RESPONSE_HANDLER, makeResponse,
  handleTransformActions, DEFAULT_TRANSFORMER, makeJson,
  reduceHandlers, someFetchHandlers, someRequestHandlers,
  identityFetchHandler, identityRequestHandler, identityHandler
}
export default createFetchAction
