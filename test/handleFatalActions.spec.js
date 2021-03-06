import 'cross-fetch/polyfill'

import { createFetchAction } from '../src/createFetchAction'
import { DEFAULT_HANDLER, handleFatalActions } from '../src/handleFatalActions'
import { createFakeFetch } from './helpers/createFakeFetch'

const realConsole = console

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
    global.console = { warn: jest.fn() }
    fatalHandler = handleFatalActions({
      [type]: testFatalHandler,
      [DEFAULT_HANDLER]: () => 'default',
    })
  })
  afterEach(() => {
    if (global.console !== realConsole) {
      global.console = realConsole
    }
  })

  it('throws on missing map', () => {
    expect(() => handleFatalActions()(error, action)).toThrow(undefined)
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(() => fatalHandler(error, action)).toThrow()
  })

  it('warns on missing fatalHandler', () => {
    const action = { type: 'missing' }
    const fatalHandler = handleFatalActions({ noMatch: (error) => error })
    expect(fatalHandler(error, action)).toBeUndefined()
    expect(console.warn).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(typeof fatalHandler).toEqual('function')
  })

  it('returns the action.payload', () => {
    expect(fatalHandler(error, action)).toEqual(payload)
  })

  it('uses default fatalHandler on unknown action', () => {
    const action = { type: 'other' }
    expect(fatalHandler(error, action)).toEqual('default')
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
        fatalHandler,
      })
      expect.assertions(1)
      return fetchAction(action)
        .then((response) => {
          expect(response).toEqual(payload)
        })
        .catch((e) => {
          realConsole.log(e)
        })
    })

    it('throws on bad responder function', () => {
      const fetchAction = createFetchAction({
        fetch,
        requestCreator,
        responder: 'bad',
        fatalHandler: handleFatalActions({
          [type]: testUndefinedFatalHandler,
          [DEFAULT_HANDLER]: () => 'default',
        }),
      })
      expect.assertions(1)
      return fetchAction(action)
        .then((response) => {
          realConsole.log(response)
        })
        .catch((e) => {
          expect(true).toEqual(true)
        })
    })
  })
})
