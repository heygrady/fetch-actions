import selectActionType from './selectActionType'
import { identityHandler } from './identityHandlers'
import invariant from 'invariant'
import warning from 'warning'
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

const handleTransformActions = map => (json, action) => {
  const type = selectActionType(action)
  invariant(type !== undefined, '@@fetch-actions/handleTransformActions action type must be defined. It is recommended that action be a valid flux-standard-action (https://github.com/acdlite/flux-standard-action)')
  invariant(map, '@@fetch-actions/handleTransformActions map must be defined')
  const transformer = map[type] || map[DEFAULT_TRANSFORMER]
  console.log(transformer)
  if (!transformer) {
    warning(transformer, `@@fetch-actions/handleTransformActions No transformer matched action.type of ${type}. Using identityHandler which simply returns json unchanged.`)
    return identityHandler(json, action)
  }
  return makeJson(transformer(json, action))
}
export default handleTransformActions
