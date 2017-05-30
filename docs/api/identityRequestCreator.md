# identityRequestCreator
The identity request creator is designed for internal use only. It is the default handler for requestCreators. Under the hood the handler doesn't do anything at all. It receives an action and returns an empty Request object.

## Usage
```js
import createFetchAction, { identityRequestCreator } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const fetchAction = createFetchAction({
  fetch,
  requestCreator: identityRequestCreator // <-- generates empty requests for every action
  // <-- add other handlers here
})

export fetchAction
```
