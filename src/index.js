import createFetchAction from './createFetchAction'

import handleRequestCreatorActions, {
  DEFAULT_HANDLER as DEFAULT_REQUEST_CREATOR,
  makeRequest,
} from './handleRequestCreatorActions'
import handleResponderActions, {
  DEFAULT_HANDLER as DEFAULT_REQUEST_HANDLER,
  makeResponse as makeRequestResponse,
} from './handleResponderActions'
import handleResponseActions, {
  DEFAULT_HANDLER as DEFAULT_RESPONSE_HANDLER,
  makeResponse,
} from './handleResponseActions'
import handleTransformerActions, {
  DEFAULT_TRANSFORMER,
  makeJson,
} from './handleTransformerActions'

import handleFatalActions, {
  DEFAULT_HANDLER as DEFAULT_FATAL_HANDLER,
} from './handleFatalActions'
import reduceHandlers, {
  reduceConfigs,
  someFatalHandlers,
  someRequestCreators,
  someResponders,
} from './reduceHandlers'
import {
  identityRequestCreator,
  identityResponder,
  identityHandler,
} from './identityHandlers'

export {
  createFetchAction,
  handleRequestCreatorActions,
  DEFAULT_REQUEST_CREATOR,
  makeRequest,
  handleResponderActions,
  DEFAULT_REQUEST_HANDLER,
  makeRequestResponse,
  handleResponseActions,
  DEFAULT_RESPONSE_HANDLER,
  makeResponse,
  handleTransformerActions,
  DEFAULT_TRANSFORMER,
  makeJson,
  handleFatalActions,
  DEFAULT_FATAL_HANDLER,
  reduceConfigs,
  reduceHandlers,
  someFatalHandlers,
  someRequestCreators,
  someResponders,
  identityRequestCreator,
  identityResponder,
  identityHandler,
}
export default createFetchAction
