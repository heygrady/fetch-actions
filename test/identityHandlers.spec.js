import { identityFetchHandler, identityRequestHandler, identityHandler } from '../src/identityHandlers'
import 'fetch-everywhere'
global.console = { error: jest.fn(), warn: jest.fn(), log: jest.fn() }

describe('identityHandlers', () => {
  describe('identityFetchHandler', () => {
    it('throws an invariant error', () => {
      const emptyRequest = new Request('')
      expect(
        identityFetchHandler()
      ).toEqual(
        emptyRequest
      )
      expect(console.error).toBeCalled()
    })
  })

  describe('identityRequestHandler', () => {
    it('returns undefined for empty args', () => {
      expect(
        identityRequestHandler()
      ).toEqual(
        undefined
      )
    })

    it('returns undefined with any payload and action', () => {
      const payload = {}
      const action = {}
      expect(
        identityRequestHandler(payload, action)
      ).toEqual(
        undefined
      )
    })

    it('returns undefined with a proper payload and action', () => {
      const type = 'TEST_ACTION'
      const payload = new Request('')
      const action = { type }
      expect(
        identityRequestHandler(payload, action)
      ).toEqual(
        undefined
      )
    })
  })

  describe('identityHandler', () => {
    it('returns the payload unchanged', () => {
      const payload = {}
      expect(
        identityHandler(payload)
      ).toEqual(
        payload
      )
    })
  })
})
