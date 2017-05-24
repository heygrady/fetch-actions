import createFetchAction from '../../../../../src/createFetchAction'
import fetch from 'fetch-everywhere'
import fetchHandler from './fetchHandlers'
import fakeFetch from './mock/fakeFetch'
import transformer from './transformers'

let useMock = false

if (__DEV__) {
  useMock = true
}

console.log(fetch)

const fetchAction = createFetchAction({
  fetchHandler,
  requestHandler: useMock ? fakeFetch : undefined,
  fetch,
  transformer
})

export default fetchAction
