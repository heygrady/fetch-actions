# someResponders
Allows you to glue responders together to run in sequence. It returns the first non-undefined response, skipping the rest of the sequence. It is called `someResponders` because only *some* of the responders may be executed.

## Usage
```js
import createFetchAction, { someResponders } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import fakeBlueberryResponder from '../your-app/responders/fakeBlueberryResponder'
import fakeCarrotResponder from '../your-app/responders/fakeCarrotResponder'
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
