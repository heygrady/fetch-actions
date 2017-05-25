# combineHandlers
You would use `combineHandlers` to chain some handlers together. Unlike combineReducers, handlers don't share the same state. For instance, if you combine two `requestHandlers` together.

```js
import fetch from 'fetch-everywhere'
import createFetchAction, { combineHandlers } from 'fetch-actions'
import loggerHandler from './mock/requestActions/loggerHandler'
import fetchPostHandler from './mock/requestActions/fetchPostHandler'

const requestHandler = combineHandlers(
  loggerHandler,
  fetchPostHandler
)

const fetchAction = createFetchAction({ fetch, requestHandler })
export default fetchAction
```
