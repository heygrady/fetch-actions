import createFetchAction from '../../../../../src/createFetchAction'
import fetch from 'fetch-everywhere'
import requestCreator from './requestCreators'
import fakeFetch from './mock/fakeFetch'
import transformer from './transformers'

let useMock = false

if (__DEV__) {
  useMock = true
}

console.log(fetch)

const fetchAction = createFetchAction({
  requestCreator,
  responder: useMock ? fakeFetch : undefined,
  fetch,
  transformer
})

export default fetchAction
