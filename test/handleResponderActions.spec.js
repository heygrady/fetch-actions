import handleResponderActions, {
  DEFAULT_HANDLER,
  makeResponse,
} from '../src/handleResponderActions'
import 'cross-fetch/polyfill'

const realConsole = console

describe('handleResponderActions', () => {
  const type = 'TEST_ACTION'
  const payload = { hello: true }
  const action = { type, payload }
  const request = new Request('')

  const testHandler = (response, action) => {
    return new Response(JSON.stringify({ data: true }))
  }

  let handler
  beforeEach(() => {
    global.console = { warn: jest.fn() }
    handler = handleResponderActions({
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
    expect(() => handleResponderActions()(request, action)).toThrow(undefined)
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(() => handler(request, action)).toThrow()
  })

  it('warns on missing handler', () => {
    const action = { type: 'missing' }
    const handler = handleResponderActions({
      noMatch: (request) => new Response(),
    })
    expect(handler(request, action)).toBeUndefined()
    expect(console.warn).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(typeof handler).toEqual('function')
  })

  it('returns a new response', () => {
    expect.assertions(1)
    return handler(request, action)
      .json()
      .then((json) => {
        expect(json.data).toEqual(true)
      })
  })

  it('uses default handler on unknown action', () => {
    const action = { type: 'other' }
    expect.assertions(1)
    return handler(request, action)
      .json()
      .then((json) => {
        expect(json.default).toEqual(true)
      })
  })

  describe('makeResponse', () => {
    it('resolves promises that return responses', () => {
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

    it('resolves promises that return data', () => {
      expect.assertions(1)
      const promise = Promise.resolve({ data: true })
      return makeResponse(promise)
        .then((response) => response.json())
        .then((json) => {
          expect(json.data).toEqual(true)
        })
    })

    it('returns responses untouched', () => {
      const response = new Response(JSON.stringify({ data: true }))
      expect(makeResponse(response)).toEqual(response)
    })

    it('returns object as response', () => {
      expect.assertions(1)
      const response = { data: true }
      return makeResponse(response)
        .json()
        .then((json) => {
          expect(json.data).toEqual(true)
        })
    })

    it('returns response from array of args, undefined init', () => {
      expect.assertions(1)
      const response = [{ data: true }, undefined]
      return makeResponse(response)
        .json()
        .then((json) => {
          expect(json.data).toEqual(true)
        })
    })

    it('returns response from array of args, empty init', () => {
      expect.assertions(1)
      const response = [{ data: true }, {}]
      return makeResponse(response)
        .json()
        .then((json) => {
          expect(json.data).toEqual(true)
        })
    })

    it('returns array as response', () => {
      expect.assertions(1)
      const response = [{ data: true }, { other: true }]
      return makeResponse(response)
        .json()
        .then((json) => {
          expect(json[0].data).toEqual(true)
        })
    })
  })
})
