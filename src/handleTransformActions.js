import selectActionType from './selectActionType'
import { identityHandler } from './identityHandlers'

export const DEFAULT_TRANSFORMER = '@@fetch-actions/handleTransformActions/DEFAULT_TRANSFORMER'

//  handle thenables and Response objects
export const makeJson = json => {
  if (typeof json.then === 'function') {
    return json.then(json => makeJson(json))
  } else if (typeof json.json === 'function') {
    return json.json()
  } else {
    return json
  }
}

const handleTransformActions = (map) => (json, action) => {
  const type = selectActionType(action)
  const transformer = map[type] || map[DEFAULT_TRANSFORMER]
  if (!transformer) {
    // TODO: invariant
    console.warn(
      '@@fetch-actions/handleTransformActions',
      `No transformer matched action.type of ${type}`,
      { map, json, action }
    )
    return identityHandler(json, action)
  }
  return makeJson(transformer(json, action))
}
export default handleTransformActions
