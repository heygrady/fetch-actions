# someRequestCreators
Allows you to glue requestCreators together to run in sequence. It returns the first non-undefined request, skipping the rest of the sequence. If your requestCreator only handles a few actions, you need to implement a default handler that returns undefined. It is called `someRequestCreators` because only *some* of the creators may be executed.

## Usage
```js
import createFetchAction, { someRequestCreators } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import carrots from '../your-app/requestCreators/carrots'
import blueberries from '../your-app/requestCreators/blueberries'
import 'fetch-everywhere'

const fetchAction = createFetchAction({
  fetch,
  requestCreator: someRequestCreators(
    carrots,
    blueberries
  )
  // <-- add other handlers here
})

export fetchAction
```
