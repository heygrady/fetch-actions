# someResponders
This function accepts a list of `responders` and executes the first one that matches, based on action type. Inspired by [reduce-reducers](https://github.com/acdlite/reduce-reducers).

Allows you to glue responders together to run in sequence. It returns the first non-undefined response, skipping the rest of the sequence. It is called `someResponders` because only *some* of the responders may be executed. By default, responders return `undefined` for unknown action types. The first responder to return something other than undefined is returned. If all responders return `undefined`, then `fetchAction` will fall back to `fetch`.

- `someResponders` executes the first matching `responder`.
- If you are trying to join [`responseHandlers`](./handleResponseActions.md) or [`transformers`](./handleTransformerActions.md) together, try [`reduceHandlers`](./reduceHandlers.md).
- If you are trying to join [`requestCreators`](./handleRequestCreatorActions.md) together, try [`someRequestHandlers`](./someRequestCreators.md).

## Usage

```js
import createFetchAction, { someResponders } from 'fetch-actions'
import fakeBlueberryResponder from './responders/fakeBlueberryResponder'
import fakeCarrotResponder from './responders/fakeCarrotResponder'
import 'fetch-everywhere'

const fetchAction = createFetchAction({
  fetch,
  responder: someResponders(
    fakeBlueberryResponder,
    fakeCarrotResponder
  )
  // <-- add other handlers here
})

export fetchAction
```
