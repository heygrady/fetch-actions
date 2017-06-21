import selectActionType from './selectActionType'
import invariant from 'invariant'
import warning from 'warning'

export const DEFAULT_HANDLER = '@@fetch-actions/handleFatalActions/DEFAULT_HANDLER'

const handleFatalActions = map => (error, action) => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  invariant(type !== undefined, '@@fetch-actions/handleFatalActions action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)')
  invariant(map, '@@fetch-actions/handleFatalActions map must be defined')
  if (!handler) {
    warning(handler, `@@fetch-actions/handleFatalActions No handler matched action.type of ${type}. Using identityRequestCreator which simply returns an empty request.`)
    return undefined
  }
  return handler(error, action)
}
export default handleFatalActions
