/* eslint max-len: ["error", { "ignoreStrings": true }] */
import selectActionType from './selectActionType'
export const DEFAULT_TRANSFORMER = '@@fetch-actions/utils/api/helpers/handleTransformActions/DEFAULT_TRANSFORMER'

const handleTransformActions = (map) => (json, action) => {
  const type = selectActionType(action)
  const transformer = map[type] || map[DEFAULT_TRANSFORMER]
  if (!transformer) {
    // TODO: invariant
    console.error(
      '@@fetch-actions/utils/api/helpers/handleTransformActions',
      `No transformer matched action.type of ${type}`,
      { map, json, action }
    )
    return
  }
  return transformer(json, action)
}
export default handleTransformActions
