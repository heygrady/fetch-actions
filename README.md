# fetch-actions
Manage fetch requests and transform them to match your app with actions dispatched from a redux app. Provides functions, intended to be called from redux middleware, that will perform an asynchronous fetch call. You can provide handlers for fielding actions to generate a fetch request and for transforming the JSON response. For advanced usage (and service mocking) you can also map actions to handlers for generating or manipulating requests and responses.

This library works well with flux standard actions like you would encounter when using redux-actions. This library is designed to mimic some of the patterns found within redux-actions. Specifically, the handlers provide a similar interface to handleActions. You can provide your own handlers and the only requirement is that they fit the functions signature for that handler. Like `const myHandler  = (response, action) => json`

## It looks like this:

```js
// bring your own fetch
import fetch from 'fetch-everywhere'

// make your own handlers
// we'll see what these look like later
import fetchHandler from './fetchHandlers'
import requestHandler from './mock/requestHandlers'
import responseHandler from './responseHandlers'
import transformer from './transformers'

// you add the the fetchAction function you need
import createFetchAction from 'fetch-action'
export const fetchAction = createFetchAction({
  fetchHandler,
  fetch,
  requestHandler,
  responseHandler,
  transformer
})
```
## Pseudo source for createFetchAction
Under the hood `createFetchAction` is setting up a promise chain for using an action to create a request and transform it into the final JSON your app is expecting.

```js
const identityHandler = (payload, action) => payload
export const createFetchAction = ({
  fetch,
  fetchHandler = identityHandler,
  requestHandler = identityHandler,
  responseHandler = identityHandler,
  transformer = identityHandler
}) => action => Promise.resolve()
  .then(() => fetchHandler(action))
  .then(request => requestHandler && requestHandler(request, action) || fetch(request))
  .then(response => responseHandler(response, action))
  .then(response => response.json())
  .then(json => transformer(json, action))
```

## Then you can use it like this:
This is highly contrived, using a thunk. We'll show a saga after this. In the thunk example we're cheating and placing it directly in the `mapDispatchToProps` of a container. It's considered bad practice to embed your request logic into your containers -- it smells like sticking MySQL code all over your PHP templates. In practice, thunks are good for performing a complex dispatch.

If our fetch request is simple, you don't need much more than an inline thunk.

```js
import { fetchPosts, loadPosts } from '../modules/posts/actions'
import { fetchAction } from '../utils/api'

// inside of a container
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetch: () => dispatch((_, getState) => {
      fetchAction(fetchPosts()) // <-- like dispatching an action, but fetching it instead
        .then( // <-- returns a promise, just like fetch does
          posts => dispatch(loadPosts(posts))  // <-- and you can dispatch the final result into your app
        )
    })
  }
}
```



You're going to want to write some fetchHandlers, responseHandler, and transformers.

- fetch-actions -- `handleFetchActions`
- response-actions -- `handleRequestActions`
- transform-actions -- `handleTransformActions`
