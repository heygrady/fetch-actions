# handleResponderActions

## Usage
```js
import createFetchAction, { handleResponderActions } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const responder = handleResponderActions({
  [MY_ACTION]: (request, action) => {
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
