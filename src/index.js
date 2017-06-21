import createFetchAction from './createFetchAction'
import handleRequestCreatorActions, { DEFAULT_HANDLER as DEFAULT_FETCH_HANDLER, makeRequest } from './handleRequestCreatorActions'
import handleResponderActions, { DEFAULT_HANDLER as DEFAULT_REQUEST_HANDLER, makeResponse as makeRequestResponse } from './handleResponderActions'
import handleResponseActions, { DEFAULT_HANDLER as DEFAULT_RESPONSE_HANDLER, makeResponse } from './handleResponseActions'
import handleTransformerActions, { DEFAULT_TRANSFORMER, makeJson } from './handleTransformerActions'
import handleFatalActions, { DEFAULT_FATAL_HANDLER } from './handleFatalActions'
import reduceHandlers, { someRequestCreators, someResponders } from './reduceHandlers'
import { identityRequestCreator, identityResponder, identityHandler } from './identityHandlers'
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
  handleRequestCreatorActions, DEFAULT_FETCH_HANDLER, makeRequest,
  handleResponderActions, DEFAULT_REQUEST_HANDLER, makeRequestResponse,
  handleResponseActions, DEFAULT_RESPONSE_HANDLER, makeResponse,
  handleTransformerActions, DEFAULT_TRANSFORMER, makeJson,
  handleFatalActions, DEFAULT_FATAL_HANDLER,
  reduceHandlers, someRequestCreators, someResponders,
  identityRequestCreator, identityResponder, identityHandler
}
export default createFetchAction
