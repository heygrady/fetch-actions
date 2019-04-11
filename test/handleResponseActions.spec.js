import handleResponseActions, {
  DEFAULT_HANDLER,
  makeResponse,
} from '../src/handleResponseActions'
import 'cross-fetch/polyfill'

const realConsole = console

describe('handleResponseActions', () => {
  const type = 'TEST_ACTION'
  const payload = { hello: true }
  const action = { type, payload }
  const response = new Response()

  const testHandler = (response, action) => {
    return new Response(JSON.stringify({ data: true }))
  }

  let handler
  beforeEach(() => {
    global.console = { warn: jest.fn() }
    handler = handleResponseActions({
      [type]: testHandler,
      [DEFAULT_HANDLER]: () => new Response(JSON.stringify({ default: true })),
    })
  })
  afterEach(() => {
    if (global.console !== realConsole) {
      global.console = realConsole
    }
  })

  it('throws on missing map', () => {
    expect(() => handleResponseActions()(response, action)).toThrow(undefined)
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(() => handler(response, action)).toThrow()
  })

  it('warns on missing handler', () => {
    const action = { type: 'missing' }
    const handler = handleResponseActions({ noMatch: (response) => response })
    expect(handler(response, action)).toEqual(response)
    expect(console.warn).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(typeof handler).toEqual('function')
  })

  it('returns a new response', () => {
    expect.assertions(1)
    return handler(response, action)
      .json()
      .then((json) => {
        expect(json.data).toEqual(true)
      })
  })

  it('uses default handler on unknown action', () => {
    const action = { type: 'other' }
    expect.assertions(1)
    return handler(response, action)
      .json()
      .then((json) => {
        expect(json.default).toEqual(true)
      })
  })

  describe('makeResponse', () => {
    it('resolves promises', () => {
      expect.assertions(1)
      const promise = Promise.resolve(
        new Response(JSON.stringify({ data: true }))
      )
      return makeResponse(promise)
        .then((response) => response.json())
        .then((json) => {
          expect(json.data).toEqual(true)
        })
    })

    it('returns undefined after resolving promises when not response-like', () => {
      expect.assertions(2)
      const promise = Promise.resolve({})
      return makeResponse(promise).then((response) => {
        expect(console.warn).toBeCalled()
        expect(response).toBeUndefined()
      })
    })

    it('returns undefined when not response-like', () => {
      expect(makeResponse({})).toBeUndefined()
    })
  })
})
