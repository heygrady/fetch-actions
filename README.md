[![npm version](https://badge.fury.io/js/fetch-actions.svg)](https://badge.fury.io/js/fetch-actions)
[![Build Status](https://travis-ci.org/heygrady/fetch-actions.svg?branch=master)](https://travis-ci.org/heygrady/fetch-actions)

# fetch-actions

_dispatch actions to handle fetch requests_

Fetch-actions allows you to dispatch actions from your redux (or similar) application to control [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). **Fetch-actions uses actions to create fetch requests and handle fetch responses.**

**[See the announcement blog post](https://heygrady.com/announcing-fetch-actions/).**

This library works well with [flux standard actions](https://github.com/acdlite/flux-standard-action) like you would encounter when using [redux-actions](https://github.com/acdlite/redux-actions). However, any [redux-compatible action](http://redux.js.org/docs/basics/Actions.html) will work just fine. Fetch-actions is heavily inspired by the [`handleActions`](https://github.com/acdlite/redux-actions#handleactionsreducermap-defaultstate) function that comes with `redux-actions`. You can learn about [the basics of actions](http://redux.js.org/docs/basics/Actions.html) and how they are used within [redux](https://github.com/reactjs/redux/).

Fetch-actions provides functions &mdash; intended to be called from [redux middleware](http://redux.js.org/docs/advanced/Middleware.html) &mdash; that will perform an asynchronous `fetch` call. You can configure handlers &mdash; conceptually similar to [how reducers work](http://redux.js.org/docs/basics/Reducers.html) &mdash; for creating fetch requests and for transforming the JSON response. For advanced usage (and service mocking) you can also provide responders and responseHandlers for creating and manipulating responses.

This library tries to conform to redux best practices, like using pure functions and avoiding side effects. It borrows liberally from concepts like actions, middleware and reducers and should fit cleanly into a redux-like workflow. Hopefully fetch-actions can bring some sanity to the process of handling asynchronous external requests in a redux-like app.

If you are already using redux with middleware to fetch data from the server, this should make your life a little easier. If you have been wondering how to cleanly integrate a react-redux application with an API, keep reading.

## Installation

```bash
yarn add fetch-actions

# you need to bring your own fetch
yarn add cross-fetch/polyfill
```

## Bring your own fetch

The fetch standard is [replacing XMLHttpRequest](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) but it hasn't been added to every environment ([can i use fetch?](http://caniuse.com/#feat=fetch)). These days JavaScript applications can run in all sorts of places. Luckily there are API-complete [fetch polyfills for everywhere](https://github.com/lucasfeliciano/cross-fetch) your code is likely to run.

[Not everyone loves fetch](https://medium.com/@shahata/why-i-wont-be-using-fetch-api-in-my-apps-6900e6c6fe78). If you're using something that wraps fetch, like [axios](https://github.com/mzabriskie/axios) or [superagent](https://github.com/visionmedia/superagent), you could still benefit from fetch-actions by using a custom responder. We will show examples of using custom responders later on. For now we're going to assume you want to use fetch in your app.

You can read [more about fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) on MDN.

In the examples below we're using `cross-fetch/polyfill` but you could just as easily use any of the many fetch libraries available, like [`whatwg-fetch`](https://github.com/github/fetch).

## fetchAction in action

In our redux application we want to [`dispatch`](http://redux.js.org/docs/api/Store.html#dispatch) an [`action`](http://redux.js.org/docs/basics/Actions.html) that triggers a fetch call. Ultimately we want to inject the resulting data into our app (using a [`reducer`](http://redux.js.org/docs/basics/Reducers.html)). Of course, redux has a strictly synchronous, [unidirectional workflow](http://redux.js.org/docs/basics/DataFlow.html). There are ways &mdash; i.e. middleware &mdash; to integrate redux with [an asynchronous flow](http://redux.js.org/docs/advanced/AsyncActions.html). That's where fetch-actions comes in.

Most redux examples leave this asynchronous middle step completely up to the implementor. We'll see later that fetch-actions is designed to work with redux-like middleware including [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-saga](https://github.com/redux-saga/redux-saga).

In the [fetch example from the redux manual](http://redux.js.org/docs/advanced/ExampleRedditAPI.html), they show the `fetch` call embedded in a `thunk`. The redux manual is purposely naive in this regard because they are trying to highlight redux, not fetch. They completely ignore any complexity, like translating an action into a proper URI or transforming the API response.

In a more complex app it might be a seen as a bad practice to bury fetch calls deep within your middleware &mdash; the URI for a fetch request is conceptually similar to SQL query. Your app will likely require some type of request builder for generating proper API requests.

Fetch-actions provides hooks into the fetch workflow so that your app can be shielded from the peculiarities of the various APIs you interface with. If the API changes, you can update your `requestCreators` and `transformers` and leave the rest of the your app alone. This can make your app more testable. At the very least it allows you to make your API integrations more predictable.

To this end, fetch-actions makes it easy to create a `fetchAction` function that accepts an action and returns data. This allows your fetch implementation to remain naive where it interfaces with your middleware, moving the complex functionality into handlers that are managed elsewhere.

### It looks like this

```js
import createFetchAction from 'fetch-actions'

// bring your own fetch
import 'cross-fetch/polyfill'

// make your own handlers
// we'll see what these look like later
import requestCreator from './requestCreators'
import transformer from './transformers'

// provide an interface between your API and your app
export const fetchAction = createFetchAction({
  fetch, // <-- inject your own fetch
  requestCreator, // <-- create requests from actions
  transformer, // <-- transform responses before returning them
})
```

### Use it like this

Here we're showing how you'd use `fetchAction` all by itself. In a real application you'd call `fetchAction` from middleware, like a thunk or a saga. We'll see those examples further below.

You can see below that `fetchAction` accepts an action and returns a promise which resolves to `data`. If you need to more control over the fetch lifecycle you should do this with the various fetch handlers we'll explore below. From within your middleware you should expect that `fetchAction` will know how to handle your actions and return the correct data. We'll see how that works later.

For now, let's feed `fetchAction` an action and get back a promise that returns `data`.

```js
// pull in our custom fetchAction function (see above)
import fetchAction from './utils/api/fetchAction'
import { fetchPosts } from './modules/posts/actions'

const action = fetchPosts() // <-- an action creator
console.log(action) // --> { type: 'FETCH_POSTS' }

// feed it an action, get a promise
const promise = fetchAction(action) // <-- returns a promise, just like fetch

// expect to receive ready-to-use data
promise.then((data) => {
  console.log(data) // <-- you could dispatch this data in your middleware
})
```

### How does createFetchAction work?

Under the hood `createFetchAction` is setting up a promise chain and calling fetch lifecycle handlers in a specific order.

Below you can see some psuedo-code for the `createFetchAction` provided by `fetch-actions`. You can see the real [source](https://github.com/heygrady/fetch-actions/blob/master/src/createFetchAction.js) is very similar.

Don't worry if you don't know what all of those handlers are doing. You can read about them in the API. This is just an example so that you can visualize how your fetch requests are being managed. We'll get into further details in later examples. For now we're still trying to stay focused on how we integrate with your middleware.

```js
import { identityRequestCreator, identityHandler } from './identityHandlers'

export const createFetchAction = ({
  fetch,
  requestCreator = identityRequestCreator,
  responder,
  responseHandler = identityHandler,
  transformer = identityHandler,
  fatalHandler,
}) => (action) =>
  Promise.resolve()
    .then(() => requestCreator(action))
    .then(
      (request) => (responder && responder(request, action)) || fetch(request)
    )
    .then((response) => responseHandler(response, action).json())
    .then((json) => transformer(json, action))
    .catch(
      (error) =>
        (fatalHandler && fatalHandler(error, action)) || console.error(error)
    )
```

## Example: Using an inline thunk

In the thunk example below we're dispatching a thunk within the `mapDispatchToProps` of a container. You should read up on [how containers work in react-redux](http://redux.js.org/docs/basics/UsageWithReact.html). You should follow any best practices recommended by [redux-thunk](https://github.com/gaearon/redux-thunk). We'll see later that a saga can be an elegant way to manage more complex requests. The example below assumes your app is correctly configured with react-redux and redux-thunk.

Caveats aside... to test out a simple fetch request, **you don't need much more than a thunk**.

Below you can see that we're using a container to provide a `fetch` function to our `PostList` component. Whenever that function is called, the container will dispatch a thunk that calls `fetchAction` and dispatches `loadPosts` to load the results into our app.

You will need to bring your own reducers for handling the `loadPosts` action. We'll see later how you might construct an end-to-end example. Fetch-actions makes no assumptions about your app's reducers.

This is what `fetchAction` might look like from within a container.

```js
import { connect } from 'react-redux'
import fetchAction from '../utils/api/fetchAction'
import PostList from '../components/PostList'
import { fetchPosts, loadPosts } from '../modules/posts/actions'

const myThunk = (dispatch) => {
  const action = fetchPosts() // <-- create an action

  const promise = fetchAction(action) // <-- fetch the data

  promise.then(
    (posts) => dispatch(loadPosts(posts)) // <-- dispatch the data
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetch: () => dispatch(myThunk), // <-- initiate the process from a component
  }
}

const PostListContainer = connect(
  undefined,
  mapDispatchToProps
)(PostList)
export default PostListContainer
```

## Next steps

- [Reddit API example](./docs/reddit-api-example.md)
- [API](./docs/api/README.md)
  - [`createFetchAction`](./docs/api/createFetchAction.md)
  - [`handleRequestCreatorActions`](./docs/api/handleRequestCreatorActions.md)
  - [`handleResponderActions`](./docs/api/handleResponderActions.md)
  - [`handleResponseActions`](./docs/api/handleResponseActions.md)
  - [`handleTransformerActions`](./docs/api/handleTransformerActions.md)
  - [`handleFatalActions`](./docs/api/handleFatalActions.md)
