import createFetchAction from '../src/createFetchAction'
import handleFatalActions, { DEFAULT_HANDLER } from '../src/handleFatalActions'
import createFakeFetch from './helpers/createFakeFetch'
import 'fetch-everywhere'

const local = {
  log: console.log
}

describe('handleTransformAction', () => {
  const type = 'TEST_ACTION'
  const payload = { hello: true }
  const action = { type, payload }
  const error = new Error('test error')
  // eslint-disable-next-line handle-callback-err
  const testFatalHandler = (error, action) => {
    return action.payload
  }
  // eslint-disable-next-line handle-callback-err
  const testUndefinedFatalHandler = (error, action) => {}

  let fatalHandler
  beforeEach(() => {
    fatalHandler = handleFatalActions({
      [type]: testFatalHandler,
      [DEFAULT_HANDLER]: () => 'default'
    })
  })

  it('throws on missing map', () => {
    expect(
      () => handleFatalActions()(error, action)
    ).toThrow(
      undefined
    )
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(
      () => fatalHandler(error, action)
    ).toThrow()
  })

  it('warns on missing fatalHandler', () => {
    global.console = { error: jest.fn() }
    const action = { type: 'missing' }
    const fatalHandler = handleFatalActions({ noMatch: error => error })
    expect(
      fatalHandler(error, action)
    ).toEqual(undefined)
    expect(console.error).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(
      typeof fatalHandler
    ).toEqual(
      'function'
    )
  })

  it('returns the action.payload', () => {
    expect(
      fatalHandler(error, action)
    ).toEqual(
      payload
    )
  })

  it('uses default fatalHandler on unknown action', () => {
    const action = { type: 'other' }
    expect(
      fatalHandler(error, action)
    ).toEqual(
      'default'
    )
  })
  describe('catches errors from fetchAction', () => {
    const data = true
    const request = new Request('http://test')
    const createResponse = () => new Response(JSON.stringify({ data }))

    let fetch
    let requestCreator

    beforeEach(() => {
      fetch = jest.fn(createFakeFetch(createResponse))
      requestCreator = jest.fn(() => request)
    })

    it('gracefully recovers on bad responder function', () => {
      const fetchAction = createFetchAction({
        fetch,
        requestCreator,
        responder: 'bad',
        fatalHandler
      })
      expect.assertions(1)
      return fetchAction(action)
        .then(response => { expect(response).toEqual(payload) })
        .catch((e) => { local.log(e) })
    })

    it('throws on bad responder function', () => {
      const fetchAction = createFetchAction({
        fetch,
        requestCreator,
        responder: 'bad',
        fatalHandler: handleFatalActions({
          [type]: testUndefinedFatalHandler,
          [DEFAULT_HANDLER]: () => 'default'
        })
      })
      expect.assertions(1)
      return fetchAction(action)
        .then(response => { local.log(response) })
        .catch((e) => { expect(true).toEqual(true) })
    })
  })
})
