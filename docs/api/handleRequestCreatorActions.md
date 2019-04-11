# handleRequestCreatorActions
This function create a `requestCreator` that maps actions to request creator functions based on action type. A request creator function creates [Requests](https://developer.mozilla.org/en-US/docs/Web/API/Request).

At a minimum your fetchAction function needs to have a `requestCreator`. The `handleRequestCreatorActions` function creates a handler that maps action types to request creator functions.

**Note:** request creators happen *before* fetch.

## Usage

```js
import createFetchAction, { handleRequestCreatorActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

// use the action to create a proper fetch Request
// @see https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
const fetchPostsRequestCreator = action => new Request(`https://www.reddit.com/r/${action.payload}.json`)

// map our action constants to our request creators
const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: fetchPostsRequestCreator
})

// add our creator to fetchAction
const fetchAction = createFetchAction({
  fetch,
  requestCreator
  // <-- add other handlers here
})

export fetchAction
```

## Request creator functions

A request creator function receives an [`action`](http://redux.js.org/docs/basics/Actions.html) (should contain a type) and returns a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request).

```js
// identity request creator
const requestCreator = (action) => new Request()
```

### Example: GET

```js
const getPosts = action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
```

### Example: POST
The following example won't work unless you are following the [reddit API rules](https://github.com/reddit/reddit/wiki/API).

```js
const createComment = action => {
  const body = JSON.stringify(action.payload)

  const headers = new Headers()
  headers.append('Content-Type', 'application/json')

  const init = {
    method: 'POST', // <-- we're setting the method to POST
    headers,
    body
  }

  return new Request('https://www.reddit.com/api/comment', init)
}
```

## DEFAULT_REQUEST_CREATOR
There is a hidden feature, allowing you to specify the default request creator to be called if no matching creators are found. If you do not define a default request creator and no matching creators are found, the [identity creator](./identityRequestCreator) will be used.

```js
import createFetchAction, {
  handleRequestCreatorActions,
  DEFAULT_REQUEST_CREATOR // <-- import the constant
} from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const fetchPostsRequestCreator = action => new Request(`https://www.reddit.com/r/${action.payload}.json`)

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: fetchPostsRequestCreator,

  // by default, make a request to example.com
  [DEFAULT_REQUEST_CREATOR]: action => new Request('https://example.com')
})

const fetchAction = createFetchAction({
  fetch,
  requestCreator
})

fetchAction({ type: 'BOGUS_ACTION' }) // --> makes a request to example.com
fetchAction({ type: FETCH_POSTS, payload: 'reactjs' }) // --> makes a request to reddit.com
```
