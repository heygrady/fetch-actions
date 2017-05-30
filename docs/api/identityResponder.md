# identityResponder
The identity request creator is designed for internal use only. It is the default handler for responders. Under the hood the handler doesn't do anything at all. It receives a request and an action and returns undefined.

## Usage
```js
import createFetchAction, { identityResponder } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const fetchAction = createFetchAction({
  fetch,
  responder: identityResponder // <-- always returns undefined
  // <-- add other handlers here
})

export fetchAction
```
