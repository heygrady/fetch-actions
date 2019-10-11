import invariant from 'tiny-invariant'
import warning from 'tiny-warning'

import { identityHandler } from './identityHandlers'
import { selectActionType } from './selectActionType'

export const DEFAULT_HANDLER =
  '@@fetch-actions/handleRequestTransformerActions/DEFAULT_HANDLER'

export const handleRequestTransformerActions = (map) => (request, action) => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  invariant(
    type !== undefined,
    '@@fetch-actions/handleRequestTransformerActions action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)'
  )
  invariant(
    map,
    '@@fetch-actions/handleRequestTransformerActions map must be defined'
  )
  if (!handler) {
    warning(
      handler,
      `@@fetch-actions/handleRequestTransformerActions No handler matched action.type of ${type}. Using identityHandler which simply returns the request unmodified.`
    )
    return identityHandler(request, action)
  }
  return handler(request, action)
}
