# someRequestCreators

This function accepts a list of `requestCreators` and executes the first one that matches, based on action type. Inspired by [reduce-reducers](https://github.com/acdlite/reduce-reducers).

Allows you to glue `requestCreators` together to run in sequence. It returns the first non-undefined request, skipping the rest of the sequence. If your requestCreator only handles a few actions, you need to implement a default handler that returns undefined. It is called `someRequestCreators` because only _some_ of the creators may be executed.

- `someRequestCreators` executes the first matching `requestCreator`.
- If you are trying to join [`responseHandlers`](./handleResponseActions.md) or [`transformers`](./handleTransformerActions.md) together, try [`reduceHandlers`](./reduceHandlers.md).
- If you are trying to join [`responders`](./handleResponderActions.md) together, try [`someResponders`](./someResponders.md).

## Usage

```js
import createFetchAction, { someRequestCreators } from 'fetch-actions'
import carrots from './requestCreators/carrots'
import blueberries from './requestCreators/blueberries'
import 'cross-fetch/polyfill'

export const fetchAction = createFetchAction({
  fetch,
  requestCreator: someRequestCreators(carrots, blueberries),
  // <-- add other handlers here
})
```

## Example: overriding default requestCreator

By default, a request creator created with [`handleRequestCreatorActions`](./handleRequestCreatorActions.md) will return an empty Request. If you are combining your request creators using `someRequestCreators` you might end up returning a blank request by accident. If you are intending to chain your requestCreators, you will need to override the default.

```js
import {
  someRequestCreators,
  handleRequestCreatorActions,
  DEFAULT_REQUEST_CREATOR,
} from 'fetch-actions'
import { FETCH_POSTS } from '../modules/reddit/constants'
import { FETCH_BLARGLE } from '../modules/flargle/constants'

const fetchPostsRequestCreator = (action) =>
  new Request(`https://www.reddit.com/r/${action.payload}.json`)

// this request creator will return empty request for unknown actions
const broken = handleRequestCreatorActions({
  [FETCH_POSTS]: fetchPostsRequestCreator,
})

// here we're overriding the default behavior
const fixed = handleRequestCreatorActions({
  [FETCH_POSTS]: fetchPostsRequestCreator,
  [DEFAULT_REQUEST_CREATOR]: () => undefined,
})

// this one runs last, so the default behavior is just fine
const flargle = handleRequestCreatorActions({
  [FETCH_BLARGLE]: (action) => new Request(`https://example.com`),
})

const brokenRequestCreator = someRequestCreators(broken, flargle)
const requestCreator = someRequestCreators(fixed, flargle)

const action = { type: FETCH_BLARGLE }

brokenRequestCreator(action) // --> returns to an empty request
requestCreator(action) // --> returns a request to example.com
```
