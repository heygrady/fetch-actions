# handleTransformerActions
This is the most common type of handler besides a [requestCreator](./handleRequestCreatorActions.md). A transformer receives JSON from the `Response.json()` of the fetch call and is expected to return a data object in a format your application is expecting. Transformers help with normalizing API responses and can protect against changes in API responses. You can greatly simplify your reducers by transforming API responses to matchthe needs of your application.

**Note:** transformers happen *after* fetch and after [responseHandlers](./handleResponseActions.md).

## Usage
```js
import createFetchAction, { handleTransformerActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const transformer = handleTransformerActions({
  [FETCH_POSTS]: (json, action) => {
    // transform a json response into data
    const data = {
      id: json.somePath.id, // <-- pull values from weird places
      attributes: {
        fullName: `${json.firstName}, ${json.lastName}`, // <-- glue values together
      }
    }
    return data // <-- return the data
  }
})

const fetchAction = createFetchAction({
  fetch,
  transformer
  // <-- add other handlers here
})

export fetchAction
```

## Example: reddit

```js
import createFetchAction, { handleRequestCreatorActions, handleTransformerActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
})

// we need a transformer
const transformer = handleTransformerActions({
  [FETCH_POSTS]: (json, action) => ({
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  })
})

const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer
})

// now it resolves to our transformed data
fetchAction({ type: FETCH_POSTS, payload: 'reactjs' }).then(data => {
  console.log(data.posts) // --> an array of posts
  console.log(data.receivedAt) // --> a timestamp
})
```
