# handleFatalActions

## Usage

```js
import createFetchAction, { handleFatalActions } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const fatalHandler = handleFatalActions({
  [MY_ACTION]: (error, action) => {
    console.error({ error, action })
  }
})

const fetchAction = createFetchAction({
  fetch,
  fatalHandler
  // <-- add other handlers here
})

export fetchAction
```
