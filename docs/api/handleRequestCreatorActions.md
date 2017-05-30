# handleRequestCreatorActions

## Usage

```js
import createFetchAction, { handleRequestCreatorActions } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const requestCreator = handleRequestCreatorActions({
  [MY_ACTION]: action => {
    // use the action to create a proper fetch Request
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
    return new Request('http://example')
  }
})

const fetchAction = createFetchAction({
  fetch,
  requestCreator
  // <-- add other handlers here
})

export fetchAction
```
