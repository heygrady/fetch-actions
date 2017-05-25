import reduceHandlers, { someFetchHandlers, someRequestHandlers } from '../src/reduceHandlers'
import 'fetch-everywhere'

describe('reduceHandlers', () => {
  let firstHandler
  let secondHandler
  const type = 'TEST_ACTION'
  const action = { type }

  beforeEach(() => {
    firstHandler = jest.fn(state => state)
    secondHandler = jest.fn(state => state)
  })

  it('returns undefined on empty handlers, state', () => {
    const handler = reduceHandlers()
    const final = handler()
    expect(final).toEqual(undefined)
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
    expect(
      state
    ).toEqual(
      final
    )
  })

  it('passes state to next handler, last handler returns final state', () => {
    const handler = reduceHandlers(
      () => ({ first: true }),
      state => {
        expect(
          state.first
        ).toEqual(
          true
        )
        return { second: true }
      }
    )
    const state = { data: true }
    const final = handler(state)
    expect(
      final.second
    ).toEqual(
      true
    )
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

  describe('someFetchHandlers', () => {
    let firstFetchHandler
    let secondFetchHandler

    beforeEach(() => {
      firstFetchHandler = jest.fn(action => undefined)
      secondFetchHandler = jest.fn(action => undefined)
    })

    it('returns undefined on empty handlers, no action', () => {
      const handler = someFetchHandlers()
      const final = handler()
      expect(final).toEqual(undefined)
    })

    it('returns undefined on empty handlers', () => {
      const handler = someFetchHandlers()
      const final = handler(action)
      expect(final).toEqual(undefined)
    })

    it('calls all handlers', () => {
      const handler = someFetchHandlers(firstFetchHandler, secondFetchHandler)
      handler()
      expect(firstFetchHandler).toBeCalled()
      expect(secondFetchHandler).toBeCalled()
    })

    it('calls only first handler', () => {
      const firstFetchHandler = jest.fn(() => new Request('http://first'))
      const handler = someFetchHandlers(firstFetchHandler, secondFetchHandler)
      handler()
      expect(firstFetchHandler).toBeCalled()
      expect(secondFetchHandler).not.toBeCalled()
    })

    it('return request from first handler', () => {
      const request = new Request('http://first')
      const firstFetchHandler = jest.fn(() => request)
      const handler = someFetchHandlers(firstFetchHandler, secondFetchHandler)
      const final = handler()
      expect(final).toEqual(request)
    })

    it('calls each handler with same action', () => {
      const handler = someRequestHandlers(
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

  describe('someRequestHandlers', () => {
    let request
    let firstRequestHandler
    let secondRequestHandler

    beforeEach(() => {
      request = new Request('http://test')
      firstRequestHandler = jest.fn((request, action) => undefined)
      secondRequestHandler = jest.fn((request, action) => undefined)
    })

    it('returns undefined on empty handlers, no action', () => {
      const handler = someRequestHandlers()
      const final = handler()
      expect(final).toEqual(undefined)
    })

    it('returns undefined on empty handlers', () => {
      const handler = someRequestHandlers()
      const final = handler(request, action)
      expect(final).toEqual(undefined)
    })

    it('calls all handlers', () => {
      const handler = someRequestHandlers(firstRequestHandler, secondRequestHandler)
      handler()
      expect(firstRequestHandler).toBeCalled()
      expect(secondRequestHandler).toBeCalled()
    })

    it('calls only first handler', () => {
      const firstRequestHandler = jest.fn(() => new Response(''))
      const handler = someRequestHandlers(firstRequestHandler, secondRequestHandler)
      handler()
      expect(firstRequestHandler).toBeCalled()
      expect(secondRequestHandler).not.toBeCalled()
    })

    it('return response from first handler', () => {
      const response = new Response()
      const firstRequestHandler = jest.fn(() => response)
      const handler = someRequestHandlers(firstRequestHandler, secondRequestHandler)
      const final = handler()
      expect(final).toEqual(response)
    })

    it('calls each handler with same request and action', () => {
      const handler = someRequestHandlers(
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
})
