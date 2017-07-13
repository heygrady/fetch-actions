# handleResponseActions
This function create a `responseHandler` that maps actions to response handler functions based on action type.

You don't normally need a `responseHandler` unless you need to handle API errors or otherwise deal directly with the Response object. If you are simply trying to transform the JSON response, use a [transformer](./handleTransformerActions.md) instead.

You might use a response handler to:
- handle legitimate API errors
- log responses
- inspect responses

**Note:** response handlers happen *after* fetch (or after responders).

## responseHandlers versus responders
The names are somewhat confusing but a responseHandler *handles* responses while a responder *creates* them. You would normally use a responseHandler to read fetch [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects. If you are trying to *create* response objects, try [responders](./handleResponderActions.md).

The full flow of a `fetchAction` call looks like this:

1. `requestCreator` &mdash; creates a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
2. `responder` or `fetch` &mdash; creates a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
3. `responseHandler` &mdash; receives a Response; must return a Response
4. `transformer` &mdash; receives the [`Response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json); should return a JavaScript object
5. `fatalHandler` &mdash; receives thrown errors.

## Usage

```js
import createFetchAction, { handleResponseActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'fetch-everywhere'

const responseHandler = handleResponseActions({
  [FETCH_POSTS]: (response, action) => { // <-- receive a response
    // you can log responses or inspect them
    console.log({ response, action })
    return response // <-- return the response (or a new one)
  }
})

const fetchAction = createFetchAction({
  fetch,
  responseHandler
  // <-- add other handlers here
})

export fetchAction
```

## Example: errors

```js
import createFetchAction, { handleRequestCreatorActions, handleResponseActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'fetch-everywhere'

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
})

const responseHandler = handleResponseActions({
  [FETCH_POSTS]: (response, action) => {
    // intercept responses that are not 200
    if (!response.ok) {
      return new Response(JSON.stringify({
        errors: [
          {
            status: response.status,
            title: response.statusText,
            detail: 'Whoops! Something was *not* ok.'
          }
        ]
      }))
    }

    // pass the response by default
    return response
  }
})

const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  responseHandler
})

fetchAction({ type: FETCH_POSTS, payload: 'reactjs' }) // --> status 200, resolves to actual response
fetchAction({ type: FETCH_POSTS, payload: 'bogus' }) // --> status 403, resolves to error response
```
