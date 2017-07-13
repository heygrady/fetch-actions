# identityRequestCreator
The identity request creator is designed for internal use only. It is the default handler for requestCreators. Under the hood the handler doesn't do anything at all. It receives an action and returns an empty Request object. The identity request creator will generate console warnings.

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

## Psuedo-code
The identity request creator looks something like this:

```js
import warning from 'warning'

export const identityRequestCreator = action => {
  warning(false, '@@fetch-actions/identityRequestCreator you should define a requestCreator for all actions. The identity fetch handler generates blank requests.')
  return new Request('')
}
```
