# handleResponseActions

## Usage
```js
import createFetchAction, { handleResponseActions } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const responseHandler = handleResponseActions({
  [MY_ACTION]: (response, action) => { // <-- receive a response
    // you can log responses or inspect them
    console.log({ response, action })
    return response // <-- return a response
  }
})

const fetchAction = createFetchAction({
  fetch,
  responseHandler
  // <-- add other handlers here
})

export fetchAction
```
