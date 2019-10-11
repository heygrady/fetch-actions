import 'cross-fetch/polyfill'

import {
  reduceConfigs,
  reduceFinallies,
  reduceHandlers,
  someFatalHandlers,
  someRequestCreators,
  someResponders,
} from '../src/reduceHandlers'

describe('reduceHandlers', () => {
  let firstHandler
  let secondHandler
  const type = 'TEST_ACTION'
  const action = { type }

  beforeEach(() => {
    firstHandler = jest.fn((state) => state)
    secondHandler = jest.fn((state) => state)
  })

  it('returns undefined on empty handlers, state', () => {
    const handler = reduceHandlers()
    const final = handler()
    expect(final).toBeUndefined()
  })

  it('returns state on empty handlers', () => {
    const handler = reduceHandlers()
    const state = { data: true }
    const final = handler(state)
    expect(final).toEqual(state)
  })

  it('calls all handlers', () => {
    const handler = reduceHandlers(firstHandler, secondHandler)
    handler()
    expect(firstHandler).toBeCalled()
    expect(secondHandler).toBeCalled()
  })

  it('returns an untouched state', () => {
    const handler = reduceHandlers(firstHandler, secondHandler)
    const state = { data: true }
    const final = handler(state)
    expect(state).toEqual(final)
  })

  it('passes state to next handler, last handler returns final state', () => {
    const handler = reduceHandlers(
      () => ({ first: true }),
      (state) => {
        expect(state.first).toEqual(true)
        return { second: true }
      }
    )
    const state = { data: true }
    const final = handler(state)
    expect(final.second).toEqual(true)
  })

  it('calls each handler with same action', () => {
    const handler = reduceHandlers(
      (state, innerAction) => {
        expect(innerAction).toEqual(action)
        return state
      },
      (state, innerAction) => {
        expect(innerAction).toEqual(action)
        return state
      }
    )
    const state = { data: true }
    handler(state, action)
  })

  it('waits for async handlers', async () => {
    const handler = reduceHandlers(
      async () => ({ first: true }),
      (state) => {
        expect(state.first).toEqual(true)
        return { second: true }
      }
    )
    const state = { data: true }
    const final = await handler(state)
    expect(final.second).toEqual(true)
  })

  describe('reduceConfigs', () => {
    let firstConfig
    let response
    let secondConfig

    beforeEach(() => {
      firstConfig = {
        fatalHandler: jest.fn(() => undefined),
        requestCreator: jest.fn(
          (action) => action.type === 'FIRST' && 'http://example.com'
        ),
        requestTransformer: jest.fn(
          (request) => new Request(request.url, { method: 'POST' })
        ),
        transformer: jest.fn(() => 5),
      }
      secondConfig = {
        fatalHandler: jest.fn(() => undefined),
        requestCreator: jest.fn(
          (action) => action.type === 'SECOND' && 'http://example.org'
        ),
        requestTransformer: jest.fn((request) => {
          request.headers.set('x-custom', 'custom')
          return request
        }),
        responseHandler: jest.fn(() => response),
        transformer: jest.fn((data) => data * 3),
      }
    })

    it('fatalHandler calls both fatalHandlers', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      const error = new Error()
      const final = config.fatalHandler(error, action)
      expect(firstConfig.fatalHandler).toBeCalled()
      expect(secondConfig.fatalHandler).toBeCalled()
      expect(final).toBeUndefined()
    })

    it('requestCreator calls first requestCreator', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      const final = config.requestCreator({ type: 'FIRST' })
      expect(firstConfig.requestCreator).toBeCalled()
      expect(secondConfig.requestCreator).not.toBeCalled()
      expect(final).toBe('http://example.com')
    })

    it('requestCreator calls both requestCreators', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      const final = config.requestCreator({ type: 'SECOND' })
      expect(firstConfig.requestCreator).toBeCalled()
      expect(secondConfig.requestCreator).toBeCalled()
      expect(final).toBe('http://example.org')
    })

    it('requestTransformer calls both requestTransformers', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      const final = config.requestTransformer(
        new Request('http://example.com/', action)
      )
      expect(firstConfig.requestTransformer).toBeCalled()
      expect(secondConfig.requestTransformer).toBeCalled()
      expect(final.url).toBe('http://example.com/')
      expect(final.method).toBe('POST')
      expect(final.headers.get('x-custom')).toBe('custom')
    })

    it('transformer calls both transformers', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      const final = config.transformer(undefined, action)
      expect(firstConfig.transformer).toBeCalled()
      expect(secondConfig.transformer).toBeCalled()
      expect(final).toBe(15)
    })

    it('responseHandler calls second responseHandler', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      const final = config.responseHandler(undefined, action)
      expect(secondConfig.responseHandler).toBeCalled()
      expect(final).toBe(response)
    })

    it('responder is callable', () => {
      const config = reduceConfigs(fetch, firstConfig, secondConfig)
      config.responder(undefined, action)
    })
  })

  describe('someRequestCreators', () => {
    let firstrequestCreator
    let secondrequestCreator

    beforeEach(() => {
      firstrequestCreator = jest.fn((action) => undefined)
      secondrequestCreator = jest.fn((action) => undefined)
    })

    it('returns undefined on empty handlers, no action', () => {
      const handler = someRequestCreators()
      const final = handler()
      expect(final).toBeUndefined()
    })

    it('returns undefined on empty handlers', () => {
      const handler = someRequestCreators()
      const final = handler(action)
      expect(final).toBeUndefined()
    })

    it('calls all handlers', () => {
      const handler = someRequestCreators(
        firstrequestCreator,
        secondrequestCreator
      )
      handler()
      expect(firstrequestCreator).toBeCalled()
      expect(secondrequestCreator).toBeCalled()
    })

    it('calls only first handler', () => {
      const firstrequestCreator = jest.fn(() => new Request('http://first'))
      const handler = someRequestCreators(
        firstrequestCreator,
        secondrequestCreator
      )
      handler()
      expect(firstrequestCreator).toBeCalled()
      expect(secondrequestCreator).not.toBeCalled()
    })

    it('return request from first handler', () => {
      const request = new Request('http://first')
      const firstrequestCreator = jest.fn(() => request)
      const handler = someRequestCreators(
        firstrequestCreator,
        secondrequestCreator
      )
      const final = handler()
      expect(final).toEqual(request)
    })

    it('calls each handler with same action', () => {
      const handler = someResponders(
        (innerAction) => {
          expect(innerAction).toEqual(action)
          return undefined
        },
        (innerAction) => {
          expect(innerAction).toEqual(action)
          return undefined
        }
      )
      handler(action)
    })
  })

  describe('someFatalHandlers', () => {
    let error
    let firstresponder
    let secondresponder

    beforeEach(() => {
      error = new Error('Something went wrong')
      firstresponder = jest.fn((error, action) => undefined) // eslint-disable-line handle-callback-err
      secondresponder = jest.fn((error, action) => undefined) // eslint-disable-line handle-callback-err
    })

    it('returns undefined on empty handlers, no action', () => {
      const handler = someFatalHandlers()
      const final = handler()
      expect(final).toBeUndefined()
    })

    it('returns undefined on empty handlers', () => {
      const handler = someFatalHandlers()
      const final = handler(error, action)
      expect(final).toBeUndefined()
    })

    it('calls all handlers', () => {
      const handler = someFatalHandlers(firstresponder, secondresponder)
      handler()
      expect(firstresponder).toBeCalled()
      expect(secondresponder).toBeCalled()
    })

    it('calls only first handler', () => {
      const firstresponder = jest.fn(() => new Response(''))
      const handler = someFatalHandlers(firstresponder, secondresponder)
      handler()
      expect(firstresponder).toBeCalled()
      expect(secondresponder).not.toBeCalled()
    })

    it('return response from first handler', () => {
      const response = new Response()
      const firstresponder = jest.fn(() => response)
      const handler = someFatalHandlers(firstresponder, secondresponder)
      const final = handler()
      expect(final).toEqual(response)
    })

    it('calls each handler with same error and action', () => {
      const handler = someFatalHandlers(
        (innerRequest, innerAction) => {
          expect(innerAction).toEqual(action)
          expect(innerRequest).toEqual(error)
          return undefined
        },
        (innerRequest, innerAction) => {
          expect(innerAction).toEqual(action)
          expect(innerRequest).toEqual(error)
          return undefined
        }
      )
      handler(error, action)
    })
  })

  describe('someResponders', () => {
    let request
    let firstresponder
    let secondresponder

    beforeEach(() => {
      request = new Request('http://test')
      firstresponder = jest.fn((request, action) => undefined)
      secondresponder = jest.fn((request, action) => undefined)
    })

    it('returns undefined on empty handlers, no action', () => {
      const handler = someResponders()
      const final = handler()
      expect(final).toBeUndefined()
    })

    it('returns undefined on empty handlers', () => {
      const handler = someResponders()
      const final = handler(request, action)
      expect(final).toBeUndefined()
    })

    it('calls all handlers', () => {
      const handler = someResponders(firstresponder, secondresponder)
      handler()
      expect(firstresponder).toBeCalled()
      expect(secondresponder).toBeCalled()
    })

    it('calls only first handler', () => {
      const firstresponder = jest.fn(() => new Response(''))
      const handler = someResponders(firstresponder, secondresponder)
      handler()
      expect(firstresponder).toBeCalled()
      expect(secondresponder).not.toBeCalled()
    })

    it('return response from first handler', () => {
      const response = new Response()
      const firstresponder = jest.fn(() => response)
      const handler = someResponders(firstresponder, secondresponder)
      const final = handler()
      expect(final).toEqual(response)
    })

    it('calls each handler with same request and action', () => {
      const handler = someResponders(
        (innerRequest, innerAction) => {
          expect(innerAction).toEqual(action)
          expect(innerRequest).toEqual(request)
          return undefined
        },
        (innerRequest, innerAction) => {
          expect(innerAction).toEqual(action)
          expect(innerRequest).toEqual(request)
          return undefined
        }
      )
      handler(request, action)
    })
  })

  describe('reduceFinallies', () => {
    let firstFinally
    let secondFinally

    beforeEach(() => {
      firstFinally = jest.fn((action) => undefined)
      secondFinally = jest.fn((action) => 'ignored')
    })

    it('returns non-Promise on empty handlers, no action', () => {
      const handler = reduceFinallies()
      const final = handler()
      expect(final && final.then).toBeUndefined()
    })

    it('returns non-Promise if handlers return non-Promises', () => {
      const handler = reduceFinallies(firstFinally, secondFinally)
      const final = handler(action, false)
      expect(final && final.then).toBeUndefined()
    })

    it('returns Promise if handlers return Promises', () => {
      const handler = reduceFinallies(
        firstFinally,
        async () => Promise.resolve(),
        secondFinally
      )
      expect.assertions(1)
      return handler(action, false).then(() => {
        expect(true).toEqual(true)
      })
    })

    it('calls all handlers', () => {
      const handler = reduceFinallies(firstFinally, secondFinally)
      handler()
      expect(firstFinally).toBeCalled()
      expect(secondFinally).toBeCalled()
    })

    it('calls each handler with same action and errored', () => {
      const handler = reduceFinallies(
        (innerAction, innerErrored) => {
          expect(innerAction).toEqual(action)
          expect(innerErrored).toEqual(true)
          return undefined
        },
        (innerAction, innerErrored) => {
          expect(innerAction).toEqual(action)
          expect(innerErrored).toEqual(true)
          return undefined
        }
      )
      handler(action, true)
    })
  })
})
