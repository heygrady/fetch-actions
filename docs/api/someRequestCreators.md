# someRequestCreators
This function accepts a list of `requestCreators` and executes the first one that matches, based on action type. Inspired by [reduce-reducers](https://github.com/acdlite/reduce-reducers).

Allows you to glue `requestCreators` together to run in sequence. It returns the first non-undefined request, skipping the rest of the sequence. If your requestCreator only handles a few actions, you need to implement a default handler that returns undefined. It is called `someRequestCreators` because only *some* of the creators may be executed.

- `someRequestCreators` executes the first matching `requestCreator`.
- If you are trying to join [`responseHandlers`](./handleResponseActions.md) or [`transformers`](./handleTransformerActions.md) together, try [`reduceHandlers`](./reduceHandlers.md).
- If you are trying to join [`responders`](./handleResponderActions.md) together, try [`someResponders`](./someResponders.md).

## Usage
```js
import createFetchAction, { someRequestCreators } from 'fetch-actions'
import carrots from './requestCreators/carrots'
import blueberries from './requestCreators/blueberries'
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
