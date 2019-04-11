import reduceHandlers, {
  someRequestCreators,
  someResponders,
} from '../src/reduceHandlers'
import 'cross-fetch/polyfill'

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
})
