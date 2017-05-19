# handleRequestActions
You don't normally need to do `handleRequestActions`. You would most likely use `handleRequestActions` for some type of logging purposes or for otherwise mocking up something for development. You can hook up custom logging code or doctor the requests that are coming from `handleFetchActions`. If you are trying to map an action to a request, you would better use `handleFetchActions` because it is intended for fielding actions that come from `fetchAction`.

The requestHandler is designed to override fetch. You would use this any time you wanted to generate valid fetch responses for certain requests that pass through fetchActions.

```js
import { handleRequestActions, DEFAULT_REQUEST_HANDLER } from 'fetch-action'
import fetchCollectionHandler from './mock/requestHandlers/fetchCollectionHandler'
import loggerHandler from './mock/requestHandlers/loggerHandler'

const requestHandler = handleRequestActions({
  []
  [DEFAULT_REQUEST_HANDLER]: loggerHandler
})
export default requestHandler
```

#
Then you create a simple handler that returns a new `Response` object from the provided `Request` object and action.

```js
const loggerHandler = (request, action) => {
  console.log(action && action.type, request)
  return false // <-- if your handler returns false then
}
export default loggerHandler
```
