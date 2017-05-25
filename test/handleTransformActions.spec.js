import handleTransformActions, { makeJson, DEFAULT_TRANSFORMER } from '../src/handleTransformActions'

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
    transformer = handleTransformActions({
      [type]: testTransformer,
      [DEFAULT_TRANSFORMER]: () => 'default'
    })
  })

  it('throws on missing map', () => {
    expect(
      () => handleTransformActions()(json, action)
    ).toThrow(
      undefined
    )
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(
      () => transformer(json, action)
    ).toThrow()
  })

  it('warns on missing transformer', () => {
    global.console = { error: jest.fn() }
    const action = { type: 'missing' }
    const transformer = handleTransformActions({ noMatch: json => json })
    expect(
      transformer(json, action)
    ).toEqual(json)
    expect(console.error).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(
      typeof transformer
    ).toEqual(
      'function'
    )
  })

  it('transforms the json', () => {
    expect(
      transformer(json, action)
    ).toEqual(
      payload
    )
  })

  it('uses default transformer on unknown action', () => {
    const action = { type: 'other' }
    expect(
      transformer(json, action)
    ).toEqual(
      'default'
    )
  })

  describe('makeJson', () => {
    it('resolves promises', () => {
      expect.assertions(1)
      const promise = Promise.resolve('hello')
      return makeJson(promise).then(json => {
        expect(
          json
        ).toEqual(
          'hello'
        )
      })
    })

    it('resolves json promises from response-like objects', () => {
      expect.assertions(1)
      const response = {
        json: () => Promise.resolve('hello')
      }
      return makeJson(response).then(json => {
        expect(
          json
        ).toEqual(
          'hello'
        )
      })
    })

    it('returns normal result', () => {
      expect(
        makeJson(json)
      ).toEqual(
        json
      )
    })
  })
})
