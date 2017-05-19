# In a saga
The core mechanics are that if you pass it an action it will pass you a promise that returns JSON.

You can call fetchAction from anywhere in your app.  If you're trying to do something more complex, you probably want to use a saga. Here we're writing a saga that will watch for `fetchPosts()` to be dispatched from a container. We're dispatching a host of housekeeping actions so that the app can properly respond to the fetching process.

```js
// modules/mosts/sagas/fetchPosts
import { put, call } from 'redux-saga/effects'
import { fetchAction } from '../utils/api'
import { startFetchingPosts, endFetchingPosts, errorFetchingPosts, failFetchingPosts, loadPosts } from '../actions'

export default function * (action) {
  yield put(startFetchingPosts())
  try {
    // configure your fecthAction to return any response you please
    const { data, errors } = call(fetchAction, action) // <-- like calling a function that returns a promise
    if (data) {
      yield put(loadPosts(data))
    }
    if (errors) {
      yield put(errorFetchingPosts(errors))
    }
  } catch (e) {
    yield put(failFetchingPosts(e))
  }
  yield put(endFetchingPosts())
}
```

## using watch actions
Instead of putting the dispatch directly into the action. like you do with a thunk, you need to tall your saga which actions to take. If you're just trying to map dispatched actions to a saga, it's easy to use `redux-saga-watch-actions`. It works a lot like `handleActions` from `redux-actions`.

```js
// modules/posts/sagas/index.js
import { watchActions } from 'redux-saga-watch-actions'
import { FETCH_POSTS, FETCH_POST, SAVE_POST } from '../modules/posts/constants'
import fetchPostsSaga from './fetchPostsSaga'
import fetchPostSaga from './fetchPostSaga'
import savePostSaga from './savePostSaga'

export default watchActions({
  [FETCH_POSTS]: fetchPostsSaga, // <-- our saga for fetchingPosts with fetchAction
  [FETCH_POST]: fetchPostSaga,
  [SAVE_POST]: savePostSaga
})
```

## configure your app to run sagas
Although you can use whichever implementation that suits your app, `redux-saga-watch-actions` provides some helpers as well as a preconfigured instance of redux-saga middleware. This middleware is meant to be instructive for how you'd implement your own. But it may suit your needs. Then you can run this watcher saga where ever you configure `redux-saga` in your app.

```js
// store/sagas.js
import sagaMiddleware, { runSaga, injectSaga, cancelTask } from 'redux-saga-watch-actions/lib/middleware'
import postsSaga from '../modules/posts/sagas'

export function * rootSaga () {
  yield [
    postsSaga()
  ]
}
runSaga(rootSaga)

export { runSaga, injectSaga, cancelTask }
export default sagaMiddleware
```

## running redux-saga middleware
You'd need to set up redux-saga the way you normally do.

```js
// store/createStore.js
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'
import sagaMiddleware from './sagas'

export default (initialState = {}) => {
  const middleware = [thunk, sagaMiddleware]
  const enhancers = []
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}
  return store
}

```
