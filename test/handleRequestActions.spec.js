import handleRequestActions, { DEFAULT_HANDLER, makeResponse } from '../src/handleRequestActions'
import 'fetch-everywhere'

describe('handleRequestActions', () => {
  const type = 'TEST_ACTION'
  const payload = { hello: true }
  const action = { type, payload }
  const request = new Request('')

  const testHandler = (response, action) => {
    return new Response(JSON.stringify({ data: true }))
  }

  let handler
  beforeEach(() => {
    handler = handleRequestActions({
      [type]: testHandler,
      [DEFAULT_HANDLER]: () => new Response(JSON.stringify({ default: true }))
    })
  })

  it('throws on missing map', () => {
    expect(
      () => handleRequestActions()(request, action)
    ).toThrow(
      undefined
    )
  })

  it('throws on missing action type', () => {
    const action = {}
    expect(
      () => handler(request, action)
    ).toThrow()
  })

  it('warns on missing handler', () => {
    global.console = { error: jest.fn() }
    const action = { type: 'missing' }
    const handler = handleRequestActions({ noMatch: request => new Response() })
    expect(
      handler(request, action)
    ).toEqual(undefined)
    expect(console.error).toBeCalled()
  })

  it('returns a function from a map', () => {
    expect(
      typeof handler
    ).toEqual(
      'function'
    )
  })

  it('returns a new response', () => {
    expect.assertions(1)
    return handler(request, action).json().then(json => {
      expect(
        json.data
      ).toEqual(
        true
      )
    })
  })

  it('uses default handler on unknown action', () => {
    const action = { type: 'other' }
    expect.assertions(1)
    return handler(request, action).json().then(json => {
      expect(
        json.default
      ).toEqual(
        true
      )
    })
  })

  describe('makeResponse', () => {
    it('resolves promises that return responses', () => {
      expect.assertions(1)
      const promise = Promise.resolve(new Response(JSON.stringify({ data: true })))
      return makeResponse(promise).then(response => response.json()).then(json => {
        expect(
          json.data
        ).toEqual(
          true
        )
      })
    })

    it('resolves promises that return data', () => {
      expect.assertions(1)
      const promise = Promise.resolve({ data: true })
      return makeResponse(promise).then(response => response.json()).then(json => {
        expect(
          json.data
        ).toEqual(
          true
        )
      })
    })

    it('returns responses untouched', () => {
      const response = new Response(JSON.stringify({ data: true }))
      expect(
        makeResponse(response)
      ).toEqual(
        response
      )
    })

    it('returns object as response', () => {
      expect.assertions(1)
      const response = { data: true }
      return makeResponse(response).json().then(json => {
        expect(
          json.data
        ).toEqual(
          true
        )
      })
    })

    it('returns response from array of args, undefined init', () => {
      expect.assertions(1)
      const response = [{ data: true }, undefined]
      return makeResponse(response).json().then(json => {
        expect(
          json.data
        ).toEqual(
          true
        )
      })
    })

    it('returns response from array of args, empty init', () => {
      expect.assertions(1)
      const response = [{ data: true }, {}]
      return makeResponse(response).json().then(json => {
        expect(
          json.data
        ).toEqual(
          true
        )
      })
    })

    it('returns array as response', () => {
      expect.assertions(1)
      const response = [{ data: true }, { other: true }]
      return makeResponse(response).json().then(json => {
        expect(
          json[0].data
        ).toEqual(
          true
        )
      })
    })
  })
})
