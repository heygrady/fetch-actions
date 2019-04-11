# handleResponderActions
This function create a `responder` that maps actions to responder functions based on action type. A responder function creates [Responses](https://developer.mozilla.org/en-US/docs/Web/API/Response).

You don't normally need responders unless you are trying to mock an API endpoint. Internally, `fetchAction` will let responders field requests instead of sending them to fetch. If no responder matches the action type, the request will be passed to fetch.

**Note:** responders happen *instead of* fetch.

## responders versus responseHandlers
The names are somewhat confusing but a responder *creates* responses while a *responseHandler* handles them. You would normally use a responder to create [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects, bypassing fetch. If you are trying to handle responses, try a [responseHandler](./handleResponseActions).

The full flow of a `fetchAction` call looks like this:

1. `requestCreator` &mdash; creates a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
2. `responder` or `fetch` &mdash; creates a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
3. `responseHandler` &mdash; receives a Response; must return a Response
4. `transformer` &mdash; receives the [`Response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json); should return a JavaScript object
5. `fatalHandler` &mdash; receives thrown errors.

## Usage
```js
import createFetchAction, { handleResponderActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const responder = handleResponderActions({
  [FETCH_POSTS]: (request, action) => {
    // use the request and action to create a fetch response
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
    const data = { whatever: true }
    return new Response(
      JSON.stringify(data)
    )
  }
})

const fetchAction = createFetchAction({
  fetch,
  responder
  // <-- add other handlers here
})

export fetchAction
```

## Example

```js
import createFetchAction, { handleRequestCreatorActions, handleResponderActions } from 'fetch-actions'
import FETCH_POSTS from '../modules/reddit/constants'
import 'cross-fetch/polyfill'

const FETCH_FAKE_POSTS = 'FETCH_FAKE_POSTS'

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
  [FETCH_FAKE_POSTS]: action => new Request(`https://example.com`)
})

// let's create a responder to mock our new example endpoint
const responder = handleResponderActions({
  [FETCH_FAKE_POSTS]: (request, action) => {
    // create fake data
    const data = {
      kind: 'Fake',
      data: {
        children: []
      }
    }

    // respond with fake data
    return new Response(JSON.stringify(data))
  }
})

// add our creator to fetchAction
const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  responder // <-- responder will override fetch
})

fetchAction({ type: FETCH_POSTS, payload: 'reactjs' }) // --> resolves to the real reddit data
fetchAction({ type: FETCH_FAKE_POSTS}) // --> resolves to the fake data, bypasses fetch
```
