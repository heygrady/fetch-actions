import selectActionType from './selectActionType'
import { identityFetchHandler } from './'
export const DEFAULT_HANDLER = '@@fetch-actions/utils/api/helpers/handleFetchActions/DEFAULT_HANDLER'

const handleFetchActions = (map, prefix, defaultInit) => action => {
  const type = selectActionType(action)
  const handler = map[type] || map[DEFAULT_HANDLER]
  if (!handler) {
    // TODO: invariant
    console.error(
      '@@fetch-actions/utils/api/helpers/handleFetchActions',
      `No handler matched action.type of ${type}`,
      { map, prefix, defaultInit, action }
    )
    return identityFetchHandler(action)
  }
  return handler(action)
}
export default handleFetchActions
