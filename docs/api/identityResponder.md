# identityResponder
The identity request creator is designed for internal use only. It is the default handler for responders. Under the hood the handler doesn't do anything at all. It receives a request and an action and returns `undefined`. When a responder returns undefined it is bypassed and the request is passed to `fetch`.

## Usage

```js
import createFetchAction, { identityResponder } from 'fetch-actions'
import 'cross-fetch/polyfill'

const fetchAction = createFetchAction({
  fetch,
  responder: identityResponder // <-- always returns undefined
  // <-- add other handlers here
})

export fetchAction
```

## Psuedo-code
The identity responder looks something like this:

```js
export const identityResponder = (payload, action) => undefined
```
