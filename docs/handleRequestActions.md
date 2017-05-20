# handleRequestActions
You don't normally need to do `handleRequestActions`. You would most likely use `handleRequestActions` for some type of logging purposes or for otherwise mocking up something for development. You can hook up custom logging code or doctor the requests that are coming from `handleFetchActions`. If you are trying to map an action to a request, you would better use `handleFetchActions` because it is intended for fielding actions that come from `fetchAction`.

The requestHandler is designed to override fetch. You would use this any time you wanted to generate valid fetch responses for certain requests that pass through fetchActions without calling fetch. Your handler must either return false -- for skipping the action -- or a `response` that is compatible with the internal `makeResponse(response)` function.



```js
import { handleRequestActions, DEFAULT_REQUEST_HANDLER } from 'fetch-action'
import fetchCollectionHandler from './mock/requestHandlers/fetchCollectionHandler'
import mockFetchPosts from './mock/requestHandlers/mockFetchPosts'
import loggerHandler from './mock/requestHandlers/loggerHandler'

const requestHandler = handleRequestActions({
  [FETCH_POSTS]: mockFetchPosts,
  [DEFAULT_REQUEST_HANDLER]: loggerHandler
})
export default requestHandler
```

## example logger
Then you create a simple handler that returns a new `Response` object from the provided `Request` object and action.

```js
const loggerHandler = (request, action) => {
  console.log(action && action.type, request)
  return false // <-- if your handler returns false then run fetch anyway
}
export default loggerHandler
```

## example mock api server

```js
let enabled = false
if (__DEV__ && __MOCK__) {
  enabled = true
}

import data from './data' // <-- load mock data from a local JS file

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export const mock = (body, init) => {
  const resolve = resolve => response => {
    const response = new Response(JSON.stringify(body), init) // <-- it's easiest to return a response
    const duration = __TEST__ ? 0 : getRandomInt(40, 2000) // <-- make tests fast
    setTimeout(() => resolve(response), duration) // <-- approximate unstable connections
  }
  return new Promise(resolve)
}

const mockFetchPosts = (request, action) => {
  if (!enabled) { return false }
  let skip = false

  // ... do things based on the request and action

  if (skip) { return false }
  const body = data
  const init = { /* valid Response init */ }

  return mock(body, init) // <-- return a promise that resolves to a request
}
export default mockFetchPosts
```
