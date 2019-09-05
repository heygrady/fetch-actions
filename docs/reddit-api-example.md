# Reddit API example

Fetch actions is fairly simple but there are a lot of moving parts. It's a functional abstraction over the already-low-level fetch api. Below we will show a partial example based on the [reddit example in the redux manual](http://redux.js.org/docs/advanced/AsyncActions.html) (see also the [full example](http://redux.js.org/docs/advanced/ExampleRedditAPI.html)).

In a basic application you would only need the `requestCreator` and `transformer` functions &mdash; so we'll show those first.

The directory structure of our app will look something like this:

```
src/
  components/
  containers/
  modules/reddit/
    constants/
    actions/
    reducers/
    index.js
  utils/api/ <-- fetchAction
    requestCreators/
    responders/
    responseHandlers/
    transformers/
    fatalHandlers/
    index.js
```

## Fetch actions

Our application needs to have a API utility for interacting with remote data sources. Fetch-actions is designed to provide such a utility in the form of a `fetchAction` function that accepts standard redux actions and returns a promise that resolves to a json object.

### File: `src/utils/api/index.js`

As you can see below, we're importing our own `fetch` and passing that into the `createFetchAction` function along with the other handlers. You can also see that we're keeping each of the handlers in separate folders. You can organize your directory structure however you'd like but it's a good practice to create many small files to keep them well-organized.

```js
import createFetchAction from 'fetch-actions'
import 'cross-fetch/polyfill'
import requestCreator from './requestCreators'
import transformer from './transformers'

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer,
})
```

## Request creators

First we're going to be creating our primary `requestCreator`. This function will work very similarly to [`handleActions`](https://redux-actions.js.org/docs/api/handleAction.html#handleactions). Although a request creator is just a function, it's convenient to only call that function for specific actions. Fetch-actions provides helpers for creating handlers that map actions to functions.

Our `requestCreator` will map actions to their appropriate request creator functions by matching the action type. In redux an action type should always be a constant. The `fetchAction` function from above will actually manage the `requestCreator`, calling it whenever `fetchAction(action)` is called.

### File: `src/utils/api/requestCreators/index.js`

You can see below that we're importing the `FETCH_POSTS` constant from our reddit module (we'll see that module later on). We're also importing a `fetchPosts` request creator function. This function should accept an `action` and return a Fetch Request. An action with a type of `FETCH_POSTS` will trigger a call to the `fetchPosts` request creator function.

```js
import { handleRequestCreatorActions } from 'fetch-actions'
import { FETCH_POSTS } from '../../modules/reddit/constants'
import fetchPosts from './fetchPosts'

export const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: fetchPosts,
})
```

### File: `src/utils/api/requestCreators/fetchPosts.js`

Here we can see a request creator function. It should look somewhat similar to a reducer. However, instead of accepting actions and returning a new state object like a reducer, a request creator accepts an action and returns a new Fetch [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).

Below you can see that we grab the `subreddit` value from the action payload and use that to construct a URL. Then we return that request. Similar to a reducer, request creators will often rely on well-formed payloads to correctly create proper requests.

Internally, `fetchAction` will pass that request object to `fetch`, which will then return a promise that resolves to some kind of response. We'll see later how the action itself is created.

The benefit here is that, in the event that reddit changes their URL structure, we can change this function and leave the rest of our app in tact.

```js
export const fetchPosts = (action) => {
  const { payload: subreddit } = action
  const request = new Request(`https://www.reddit.com/r/${subreddit}.json`)
  return request
}
```

## Transformers

A transformer is expected to receive a JSON response and transform it into an object that the application is expecting. Internally, `fetchAction` will call the transformer as the last step in the promise chain, allowing for responses to be transformed automatically.

### File: `src/utils/api/transformers/index.js`

Just like we did with the `requestCreator` above: we need to import our constants and our transformer functions, the transformer handler will map actions to transform functions, and our `transformer` will be managed by `fetchActions`.

```js
import { handleTransformerActions } from 'fetch-actions'
import { FETCH_POSTS } from '../../modules/reddit/constants'
import fetchPosts from './fetchPosts'

export const transformer = handleTransformerActions({
  [FETCH_POSTS]: fetchPosts,
})
```

### File: `src/utils/api/transformers/fetchPosts.js`

Transformer functions, like the request creator function above, are quite simple. In this case they are almost exactly like reducers except that instead of returning a new state, transformers return a new object.

A transformer receives the result from a [`response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json) promise.

Below we can see that we're creating a new JSON response that will contain only the posts along with a date stamp. This allows our app to work with a predictable response from the API. If the data that reddit returns should ever change, we could update this transformer and leave the rest of the application in tact.

```js
export const fetchPosts = (json, action) => {
  return {
    posts: json.data.children.map((child) => child.data),
    receivedAt: Date.now(),
  }
}
```

## Module

We're going to quickly recreate the application structure from the [redux reddit example](http://redux.js.org/docs/advanced/AsyncActions.html) (also [full reddit api example](http://redux.js.org/docs/advanced/ExampleRedditAPI.html)). We're going to be creating something functionally equivalent, but using redux-actions where possible.

### File: `src/modules/reddit/index.js`

By default our module will export a reducer. This will be used in our redux app. You can read the full redux example linked above for information on using reducers with redux.

```js
export { default as reducer } from './reducers'
```

## Actions, constants

### File: `src/modules/reddit/constants/index.js`

We're putting all of our constants in a separate file to more closely match a recommended module structure. The redux example shows all of the constants mixed in with their associated actions but that gets messy as your app grows. It's better to put them in a separate file and even break that file into smaller pieces as required.

```js
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const FETCH_POSTS = 'FETCH_POSTS' // <-- this is different than the redux example
```

### File: `src/modules/reddit/actions/index.js`

We're putting all of our actions in a single file as well. We're using `createAction` to create simple actions that will have a type and a payload. You can create your actions however you'd like, as long as they have a type. However, using redux-actions like this can ease the pain of making many simple action creators.

```js
import { createAction } from 'redux-actions'
import {
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  FETCH_POSTS,
} from '../constants'
import fetchAction from '../../utils/api'

export const selectSubreddit = createAction(SELECT_SUBREDDIT)
export const invalidateSubreddit = createAction(INVALIDATE_SUBREDDIT)
export const requestPosts = createAction(REQUEST_POSTS)
export const receivePosts = createAction(
  RECEIVE_POSTS,
  (subreddit, posts, receivedAt) => ({
    subreddit,
    posts,
    receivedAt,
  })
)

// notice this isn't exported
// we're sending this action to the fetchAction function
// we need this because the fetchPosts action is actually a thunk
const fetchPostsAction = createAction(FETCH_POSTS)

// a thunk that dispatches two actions
export const fetchPosts = (subreddit) => (dispatch) => {
  // we need to create our fetch action
  const action = fetchPostsAction(subreddit)

  dispatch(requestPosts(subreddit))

  // Finally, we're calling fectchAction!
  // it returns a promise that resolves to the transformed json response
  // we're taking the two value's we're expecting and dispatching them
  fetchAction(action).then(({ posts, receivedAt }) => {
    dispatch(receivePosts(subreddit, posts, receivedAt))
  })
}

// this is a helper function
const shouldFetchPosts = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return !!posts.didInvalidate
  }
}

// another thunk
export const fetchPostsIfNeeded = (subreddit) => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    dispatch(fetchPosts(subreddit))
  }
}
```

## Reducers

Here we're splitting the reducers into multiple files to make them easier to manage. These reducers are functionally equivalent to the ones in the redux reddit example linked above.

### File: `src/modules/reddit/reducers/index.js`

```js
import { combineReducers } from 'redux'
import postsBySubreddit from './postsBySubreddit'
import selectedSubreddit from './selectedSubreddit'

const reducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit,
})

export default reducer
```

### File: `src/modules/reddit/reducers/postsBySubreddit.js`

We're using `handleActions` to make it easier to create reducers without needing all of the switch-case boilerplate.

```js
import { handleActions, combineActions } from 'redux-actions'
import {
  INVALIDATE_SUBREDDIT,
  REQUEST_POSTS,
  RECEIVE_POSTS,
} from '../constants'

const posts = handleAction(
  {
    [INVALIDATE_SUBREDDIT]: (state, action) => ({
      ...state,
      didInvalidate: true,
    }),
    [REQUEST_POSTS]: (state, action) => ({
      ...state,
      isFetching: true,
      didInvalidate: false,
    }),
    [RECEIVE_POSTS]: (state, action) => ({
      ...state,
      isFetching: false,
      didInvalidate: false,
      items: action.payload.posts,
      lastUpdated: action.payload.receivedAt,
    }),
  },
  {
    isFetching: false,
    didInvalidate: false,
    items: [],
  }
)

const postsBySubreddit = handleActions(
  {
    [combineActions(INVALIDATE_SUBREDDIT, REQUEST_POSTS, RECEIVE_POSTS)]: (
      state,
      action
    ) => {
      const subreddit = action.payload.subreddit || action.payload
      return {
        ...state,
        [subreddit]: posts(state[subreddit], action),
      }
    },
  },
  {}
)

export default postsBySubreddit
```

### File: `src/modules/reddit/reducers/selectedSubreddit.js`

This is the other reducer for managing which subreddit is selected. This is functionally identical to the reducer in the redux tutorial linked above.

```js
import { handleActions } from 'redux-actions'
import { SELECT_SUBREDDIT } from '../constants'

const selectedSubreddit = handleActions(
  {
    [SELECT_SUBREDDIT]: (state, action) => action.payload,
  },
  'reactjs'
)

export default selectedSubreddit
```

## Next steps

If you're trying to get a complete example, you will need to complete the [example from the redux docs](http://redux.js.org/docs/advanced/ExampleRedditAPI.html) and merge it with what is shown here.
