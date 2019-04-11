# handleFatalActions
This function create a `fatalHandler` that maps actions to fatal handler functions based on action type. Fatal handlers are executed during the [`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) clause of a `fetchAction` promise chain.

If everything is going smoothly you won't need a fatal handler. However, if you want to catch any thrown errors in the promise chain you need a [`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method in your promise chain. Luckily, [`createFetchAction`](./createFetchAction.md) allows you to specify a fatal handler that is called in the case that an exception is thrown at any point during the promise chain.

By default fetchAction will catch and re-throw the error, leaving error handling up to the implementor. Using a fatalHandler can make it easy to catch predictable fatal errors and handle them gracefully.

## Usage

```js
import createFetchAction, { handleFatalActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const fatalHandler = handleFatalActions({
  [FETCH_POSTS]: (error, action) => {
    console.error({ error, action })
  }
})

const fetchAction = createFetchAction({
  fetch,
  fatalHandler
  // <-- add other handlers here
})

export fetchAction
```

## Example

```js
import createFetchAction, { handleRequestCreatorActions, handleTransformerActions, handleFatalActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
})

const transformer = handleTransformerActions({
  [FETCH_POSTS]: (json, action) => ({
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  })
})

const fatalHandler = handleFatalActions({
  [FETCH_POSTS]: (error, action) => {
    console.error(error)
    return {
      posts: [],
      receivedAt: Date.now(),
      error: 'Something went horribly wrong'
    }
  }
})

const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer,
  fatalHandler
})

// this should work just fine
fetchAction({ type: FETCH_POSTS, payload: 'reactjs' }).then(data => {
  console.log(data.posts) // --> an array of posts
  console.log(data.receivedAt) // --> a timestamp
})

// this should blow up the requestCreator
const bad = {
  toString() { throw Error('I will break you!') }
}

// now we get a response from our fatal handler
fetchAction({ type: FETCH_POSTS, payload: bad }).then(data => {
  console.log(data.posts) // --> an empty array of posts
  console.log(data.receivedAt) // --> a timestamp
  console.log(data.error) // --> 'Something went horribly wrong'
})
```
