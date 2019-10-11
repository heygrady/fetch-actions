import 'cross-fetch/polyfill'

import {
  DEFAULT_HANDLER,
  handleRequestTransformerActions,
} from '../src/handleRequestTransformerActions'

const realConsole = console

describe('handleRequestTransformerActions', () => {
  const type = 'TEST_ACTION'
  const payload = { hello: true }
  const action = { type, payload }

  const testHandler = (request, action) => {
    return new Request(request.url, { method: 'POST' })
  }

  let handler
  let request
  beforeEach(() => {
    global.console = { warn: jest.fn() }
    handler = handleRequestTransformerActions({
      [type]: testHandler,
      [DEFAULT_HANDLER]: () => new Request('http://default'),
    })
    request = new Request('http://original/')
  })
  afterEach(() => {
    if (global.console !== realConsole) {
      global.console = realConsole
    }
  })

  it('throws on missing map', () => {
    expect(() => handleRequestTransformerActions()(action)).toThrow(undefined)
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(() => handler(request, action)).toThrow()
  })

  it('warns on missing handler', () => {
    const action = { type: 'missing' }
    const handler = handleRequestTransformerActions({
      noMatch: (action) => new Request('http://no-match'),
    })
    expect(handler(request, action)).toEqual(new Request('http://original/'))
    expect(console.warn).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(typeof handler).toEqual('function')
  })

  it('returns a new request', () => {
    const result = handler(request, action)
    expect(result.url).toEqual('http://original/')
    expect(result.method).toEqual('POST')
  })

  it('uses default handler on unknown action', () => {
    const action = { type: 'other' }
    expect(handler(request, action).url).toEqual('http://default/')
  })
})
