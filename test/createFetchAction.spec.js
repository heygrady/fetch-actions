import createFetchAction from '../src/createFetchAction'
import createFakeFetch from './helpers/createFakeFetch'
import 'cross-fetch/polyfill'
const local = {
  log: console.log,
}
global.console = {
  error: () => undefined,
  log: local.log,
} // suppress errors

describe('createFetchAction', () => {
  const type = 'TEST_ACTION'
  const action = { type }
  const data = true
  const request = new Request('http://test')
  const createResponse = () => new Response(JSON.stringify({ data }))

  let fetch
  let requestCreator
  let responder
  let responseHandler
  let transformer
  let fetchAction

  beforeEach(() => {
    fetch = jest.fn(createFakeFetch(createResponse))
    requestCreator = jest.fn(() => request)
    responder = jest.fn(() => false)
    responseHandler = jest.fn((response) => response)
    transformer = jest.fn((json) => json)

    fetchAction = createFetchAction({
      fetch,
      requestCreator,
      responder,
      responseHandler,
      transformer,
    })
  })

  it('returns a function', () => {
    const fetchAction = createFetchAction()
    expect(typeof fetchAction).toEqual('function')
  })

  it('throws on empty handlers', () => {
    const fetchAction = createFetchAction()
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on action missing type', () => {
    const action = { noType: true }
    expect(() => {
      fetchAction(action)
    }).toThrow()
  })

  // NOTE: this is double-testing the identityRequestCreator
  it('warns on missing requestCreator', () => {
    global.console = { warn: jest.fn() }
    const fetchAction = createFetchAction({ fetch })
    expect.assertions(1)
    return fetchAction(action).then((data) => {
      expect(console.warn).toBeCalled()
    })
  })

  it('throws on bad fetch function', () => {
    const fetchAction = createFetchAction({ fetch: 'bad' })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on bad fetch function, even with good responder', () => {
    const fetchAction = createFetchAction({
      fetch: 'bad',
      responder: createResponse,
    })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on bad responder function', () => {
    const fetchAction = createFetchAction({ responder: 'bad' })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on bad responder function, even with good fetch', () => {
    const fetchAction = createFetchAction({ responder: 'bad', fetch })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on good responder function when fetch is missing and responder returns false', () => {
    const fetchAction = createFetchAction({ responder })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on bad response in responder, missing json method', () => {
    const fetchAction = createFetchAction({ responder: () => ({ bad: true }) })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on bad response in responseHandler, missing json method', () => {
    const fetchAction = createFetchAction({
      fetch,
      responseHandler: () => ({ bad: true }),
    })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('throws on bad response, json must return thennable', () => {
    const fetchAction = createFetchAction({
      fetch,
      responseHandler: () => ({ json: () => ({ bad: true }) }),
    })
    expect.assertions(1)
    return fetchAction(action)
      .then((response) => local.log(response))
      .catch((e) => {
        // local.log(e) // Invariant
        expect(true).toEqual(true)
      })
  })

  it('calls all handlers', () => {
    expect.assertions(5)
    return fetchAction(action).then(() => {
      expect(fetch).toBeCalled()
      expect(requestCreator).toBeCalled()
      expect(responder).toBeCalled()
      expect(responseHandler).toBeCalled()
      expect(transformer).toBeCalled()
    })
  })
})
