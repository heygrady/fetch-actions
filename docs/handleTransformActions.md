# handleTransformActions
Creating transformers is a key benefit, along with `fetchHandlers` of using `fetch-actions`. This allows you to take any JSON and return JSON that is well formatted to your app. From project to project -- or even within projects -- your api endpoints will be outputting some custom things. It's always best to separate your internal app data from the remote data source. The remote data source then is making a contract with your transformer to return predictable data structures and your transformer is making a contract with your app to provide consistent data. As long as there is a way to translate one format into another, a transformer is your apps best friend. This makes it possible to integrate well-built 3rd-party libraries that can receive data from any transformable source -- provided you want to provide a transformer.

# Usage

```js
import { handleTransformActions } from 'fetch-action'
import { FETCH_POSTS } from '../modules/posts/constants'
import { FETCH_COMMENTS } from '../modules/comments/constants'
import postsTransformer from './transformers/postsTransformer'
import commentsTransformer from './transformers/commentsTransformer'
const transformer = handleTransformActions({
  [FETCH_POSTS]: postsTransformer,
  [FETCH_COMMENTS]: commentsTransformer
})
export default transformer
```

## Example transformer

Then you create a simple transformer that returns a new json object from the provided json object and action.

```js
import get from 'lodash.get'

const postsTransformer = (json, action) => {
  return {
    data: get(json, 'any.random.location', [])
    included: get(json, 'place.for.embedded.documents')
    errors: get(json, 'wherever.errors.are.stored')
  }
}
export default postsTransformer
```

## Example deep transformers

```js
import get from 'lodash.get'
import weirdDataTransformer from './weirdDataTransformer'
import embeddedDocumentsTransformer from './embeddedDocumentsTransformer'
import errorTransformer from './errorTransformer'

const postsTransformer = (json, action) => {
  return {
    data: weirdDataTransformer(
      get(json, 'any.random.location', []), // <-- pass any valid JSON.parse() output, or compatible object
      action // <-- pass any action, if the transformer cares about the action for whichever reason
    ),
    included: embeddedDocumentsTransformer(
      get(json, 'place.for.embedded.documents'),
      action
    ),
    errors: errorTransformer(
      get(json, 'wherever.errors.are.stored'),
      action
    )
  }
}
export default postsTransformer
```
