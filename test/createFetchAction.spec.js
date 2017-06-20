import createFetchAction from '../src/createFetchAction'
import createFakeFetch from './helpers/createFakeFetch'
import 'fetch-everywhere'
global.console = { error: () => undefined } // suppress errors

describe('createFetchAction', () => {
  const type = 'TEST_ACTION'
  const action = { type }
  const data = true
  const request = new Request('http://test')
  const createResponse = () => new Response(JSON.stringify({ data }))

  let fetch
  let fetchHandler
  let requestHandler
  let responseHandler
  let transformer
  let fetchAction

  beforeEach(() => {
    fetch = jest.fn(createFakeFetch(createResponse))
    fetchHandler = jest.fn(() => request)
    requestHandler = jest.fn(() => false)
    responseHandler = jest.fn(response => response)
    transformer = jest.fn(json => json)

    fetchAction = createFetchAction({
      fetch,
      fetchHandler,
      requestHandler,
      responseHandler,
      transformer
    })
  })

  it('returns a function', () => {
    const fetchAction = createFetchAction()
    expect(
      typeof fetchAction
    ).toEqual(
      'function'
    )
  })

  it('throws on empty handlers', () => {
    const fetchAction = createFetchAction()
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
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
  it('warns on missing fetchHandler', () => {
    global.console = { error: jest.fn() }
    const fetchAction = createFetchAction({ fetch })
    expect.assertions(1)
    return fetchAction(action).then((data) => {
      expect(console.error).toBeCalled()
    })
  })

  it('throws on bad fetch function', () => {
    const fetchAction = createFetchAction({ fetch: 'bad' })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on bad fetch function, even with good requestHandler', () => {
    const fetchAction = createFetchAction({ fetch: 'bad', requestHandler: createResponse })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on bad requestHandler function', () => {
    const fetchAction = createFetchAction({ requestHandler: 'bad' })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on bad requestHandler function, even with good fetch', () => {
    const fetchAction = createFetchAction({ requestHandler: 'bad', fetch })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on good requestHandler function when fetch is missing and requestHandler returns false', () => {
    const fetchAction = createFetchAction({ requestHandler })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on bad response, missing json method', () => {
    const fetchAction = createFetchAction({ requestHandler: () => ({ bad: true }) })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on bad response, missing json method', () => {
    const fetchAction = createFetchAction({ fetch, responseHandler: () => ({ bad: true }) })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('throws on bad response, json must return thennable', () => {
    const fetchAction = createFetchAction({
      fetch,
      responseHandler: () => ({ json: () => ({ bad: true }) })
    })
    expect.assertions(1)
    return fetchAction(action).catch((e) => {
      expect(true).toEqual(true)
    })
  })

  it('calls all handlers', () => {
    expect.assertions(5)
    return fetchAction(action).then(() => {
      expect(fetch).toBeCalled()
      expect(fetchHandler).toBeCalled()
      expect(requestHandler).toBeCalled()
      expect(responseHandler).toBeCalled()
      expect(transformer).toBeCalled()
    })
  })
})
