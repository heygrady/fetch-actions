# identityHandler

The identity handler is designed for internal use only. It is the default handler for responseHandlers and transformers. Under the hood the handler doesn't do anything at all. It receives an object and an action and returns the object.

## Usage

```js
import createFetchAction, { identityHandler } from 'fetch-actions'
import 'cross-fetch/polyfill'

export const fetchAction = createFetchAction({
  fetch,
  responseHandler: identityHandler,
  transformer: identityHandler,
  // <-- add other handlers here
})
```

## Psuedo-code

The identity handler looks something like this:

```js
export const identityHandler = (payload, action) => payload
```
