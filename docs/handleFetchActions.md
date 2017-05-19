# handleFetchActions
This function is used to create a fetch handler. A fetch handler receives a flux-standard action returns a valid fetch `Request` or valid fetch `input`. By default it returns an empty request and throws an error. for advanced usage you can easily nest handlers by overriding the default pseudo action that is matched when no other handler can be found.

## Usage:
A `fetchHandler` will take an action and map it, by action type, to a handler function. You need to create a fetchHandler for your module and a handler function for each action. You may use the `combineActions()` helper from `redux-actions` to map multiple actions to the same helper.

```js
import { handleFetchActions } from 'fetch-action'
import { FETCH_POSTS } from '../modules/posts/constants'
import { FETCH_COMMENTS } from '../modules/comments/constants'
import postsHandler from './fetchHandlers/postsHandler'
import commentsHandler from './fetchHandlers/commentsHandler'
const fetchHandler = handleFetchActions({
  [FETCH_POSTS]: postsHandler,
  [FETCH_COMMENTS]: commentsHandler
})
export default fetchHandler
```

Then you create a simple handler that returns a new Request object from the provided action.

```js
import get from 'lodash.get'
import { selectBaseUrl, select }  from 'fetch-action'
const postsHandler = (action) => {
  const input = { /* valid fetchRequest input object */ }
  const init = { /* valid fetchRequest init object */ }
  const request = new Request(input, init)

  return request // or anything that is valid as the first argument for fetch
}
export default postsHandler
```
