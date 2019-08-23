# reduceHandlers

Allows you to glue handlers together to run in sequence. It's useful for [`responseHandlers`](./handleResponseActions.md) and [`transformers`](./handleTransformerActions.md). Inspired by [reduce-reducers](https://github.com/acdlite/reduce-reducers).

Similar to `reduceReducers`, `reducerHandlers` simply passes the previous return value to the next handler in the sequence. When used with handlers created by `handleResponseActions` or `handleTransformerActions`, only the functions matching the action type will be executed.

- `reduceHandlers` is for `responseHandlers` and `transformers`.
- If you are trying to join [`requestCreators`](./handleRequestCreatorActions.md) together, try [`someRequestHandlers`](./someRequestCreators.md).
- If you are trying to join [`responders`](./handleResponderActions.md) together, try [`someResponders`](./someResponders.md).

## Usage

```js
import createFetchAction, { reduceHandlers } from 'fetch-actions'
import 'cross-fetch/polyfill'

import logHandler from './responseHandlers/logHandler'
import errorHandler from './responseHandlers/errorHandler'
import blueberryTransformer from './transformers/blueberryTransformer'
import carrotTransformer from './transformers/carrotTransformer'

const fetchAction = createFetchAction({
  fetch,
  responseHandler: reduceHandlers(
    logHandler, // <-- logs all responses
    errorHandler // <-- fields error responses
  ),
  transformer: reduceHandlers(
    blueberryTransformer, // <-- handles blueberry actions
    carrotTransformer // <-- handles carrot actions
  )
})

export fetchAction
```
