# reduceHandlers
Allows you to glue handlers together to run in sequence. It's useful for [`responseHandlers`](./handleResponseActions.md) and [`transformers`](./handleTransformerActions.md). Inspired by [reduce-reducers](https://github.com/acdlite/reduce-reducers).

- `reduceHandlers` is for `responseHandlers` and `transformers`.
- If you are trying to join [`requestCreators`](./handleRequestCreatorActions.md) together, try [`someRequestHandlers`](./someRequestCreators.md).
- If you are trying to join [`responders`](./handleResponderActions.md) together, try [`someResponders`](./someResponders.md).

## Usage

```js
import createFetchAction, { reduceHandlers } from 'fetch-actions'
import 'fetch-everywhere'

import logHandler from './responseHandlers/logHandler'
import errorHandler from './responseHandlers/errorHandler'
import firstTransformer from './transformers/firstTransformer'
import secondTransformer from './transformers/secondTransformer'

const fetchAction = createFetchAction({
  fetch,
  responseHandler: reduceHandlers(
    logHandler,
    errorHandler
  ),
  transformer: reduceHandlers(
    firstTransformer,
    secondTransformer
  )
})

export fetchAction
```
