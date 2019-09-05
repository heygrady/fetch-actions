import {
  DEFAULT_TRANSFORMER,
  handleTransformerActions,
  makeJson,
} from '../src/handleTransformerActions'

const realConsole = console

describe('handleTransformAction', () => {
  const type = 'TEST_ACTION'
  const payload = { hello: true }
  const action = { type, payload }
  const json = {}
  const testTransformer = (json, action) => {
    return action.payload
  }

  let transformer
  beforeEach(() => {
    global.console = { warn: jest.fn() }
    transformer = handleTransformerActions({
      [type]: testTransformer,
      [DEFAULT_TRANSFORMER]: () => 'default',
    })
  })
  afterEach(() => {
    if (global.console !== realConsole) {
      global.console = realConsole
    }
  })

  it('throws on missing map', () => {
    expect(() => handleTransformerActions()(json, action)).toThrow(undefined)
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(() => transformer(json, action)).toThrow()
  })

  it('warns on missing transformer', () => {
    const action = { type: 'missing' }
    const transformer = handleTransformerActions({ noMatch: (json) => json })
    expect(transformer(json, action)).toEqual(json)
    expect(console.warn).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(typeof transformer).toEqual('function')
  })

  it('transforms the json', () => {
    expect(transformer(json, action)).toEqual(payload)
  })

  it('uses default transformer on unknown action', () => {
    const action = { type: 'other' }
    expect(transformer(json, action)).toEqual('default')
  })

  describe('makeJson', () => {
    it('resolves promises', () => {
      expect.assertions(1)
      const promise = Promise.resolve('hello')
      return makeJson(promise).then((json) => {
        expect(json).toEqual('hello')
      })
    })

    it('resolves json promises from response-like objects', () => {
      expect.assertions(1)
      const response = {
        json: () => Promise.resolve('hello'),
      }
      return makeJson(response).then((json) => {
        expect(json).toEqual('hello')
      })
    })

    it('returns normal result', () => {
      expect(makeJson(json)).toEqual(json)
    })
  })
})
