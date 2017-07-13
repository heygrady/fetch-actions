# createFetchAction
The core functionality of fetch-actions is contained within `createFetchAction`. The idea is to wrap a typical `fetch` request in a promise chain that pushes the data into different handlers in a predictable fashion. The goal is to standardize some of the boilerplate involved managing fetch requests without sacrificing any functionality.

## Basic Usage

```js
import createFetchAction from 'fetch-actions'
import 'fetch-everywhere'

const fetchAction = createFetchAction({
  fetch
  // <-- add handlers here
})

export fetchAction
```

**Note:** if you do not specify a `requestCreator` function the [`identityRequestCreator`](./identityRequestCreator.md) will be used, which will generate console warnings.

## Full Usage
Below you can see all of the configuration options.

```js
import createFetchAction from 'fetch-actions'
import 'fetch-everywhere'

import requestCreator from './requestCreators'
import responder from './responders'
import responseHandler from './responseHandlers'
import transformer from './transformers'
import fatalHandler from './fatalHandler'


const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  responder,
  responseHandler,
  transformer,
  fatalHandler
})

export fetchAction
```

### Available handlers
- [handleRequestCreatorActions](./handleRequestCreatorActions.md)
- [handleResponderActions](./handleResponderActions.md)
- [handleResponseActions](./handleResponseActions.md)
- [handleTransformerActions](./handleTransformerActions.md)
- [handleFatalActions](./handleFatalActions.md)

## Example
Here's an inline example to show roughly how `fetchAction` works.

```js
import createFetchAction, { handleRequestCreatorActions, handleTransformerActions } from 'fetch-actions'
import { createAction } from 'redux-actions'
import 'fetch-everywhere'

// we need an action and action creator
const FETCH_POSTS = 'FETCH_POSTS'
const fetchPosts = createAction(FETCH_POSTS)

// we need a request creator
const fetchPostsRequestCreator = action => new Request(`https://www.reddit.com/r/${action.payload}.json`)

// we need a transformer
const fetchPostsTransformer = (json, action) => ({
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
})

// let's create our fetch action function
const fetchAction = createFetchAction({
  fetch,
  requestCreator: handleRequestCreatorActions({
    [FETCH_POSTS]: fetchPostsRequestCreator
  }),
  transformer: handleTransformerActions({
    [FETCH_POSTS]: fetchPostsTransformer
  })
})

// we need an action
const action = fetchPosts('reactjs')

// now we can make a fetch request
// 1. pass in an action
// 2. receive a promise
// 3. resolves to transformed data
fetchAction(action).then(data => {
  console.log(data)
})
```
