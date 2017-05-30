# reduceHandlers
Allows you to glue handlers together to run in sequence. It's useful for responseHandlers and transformers.

## Usage
```js
import createFetchAction, { reduceHandlers } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import logHandler from '../your-app/responseHandlers/logHandler'
import errorHandler from '../your-app/responseHandlers/errorHandler'
import firstTransformer from '../your-app/transformers/firstTransformer'
import secondTransformer from '../your-app/transformers/secondTransformer'
import 'fetch-everywhere'

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
  // <-- add other handlers here
})

export fetchAction
```
