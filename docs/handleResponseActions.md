# handleRequestActions
You don't normally need to do `handleRequestActions`. You would most likely use `handleRequestActions` for some type of logging purposes or for otherwise mocking up something for development. You can hook up custom logging code or doctor the requests that are coming from `handleFetchActions`. If you are trying to map an action to a request, you would better use `handleFetchActions` because it is intended for fielding actions that come from `fetchAction`.

```js
import { handleResponseActions, combineHandlers, DEFAULT_RESPONSE_HANDLER } from 'fetch-action'
import loggerHandler from './responseHandlers/loggerHandler'
import errorHandler from './responseHandlers/errorHandler'

const requestHandler = handleRequestActions({
  [DEFAULT_REQUEST_HANDLER]: combineHandlers(
    loggerHandler,
    errorHandler
  )
})
export default requestHandler
```

Then you create a simple handler that returns a new `Request` object from the provided `Request` object and action.

## Example logger handler
```js
const loggerHandler = (response, action) => {
  console.log(action && action.type, response)
  return response
}
export default loggerHandler
```

## Example of passing configuration through the action

```js
import get from 'lodash.get'

const fetchCollectionHandler = (response, action) => {
  const collection = get(action, 'meta.collection')
  if (collection === 'posts') {
    return new Response() // <-- override the response if you want to
  }
  return response
}
export default fetchPostsHandler
```
