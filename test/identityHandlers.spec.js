import { identityRequestCreator, identityResponder, identityHandler } from '../src/identityHandlers'
import 'fetch-everywhere'

describe('identityHandlers', () => {
  describe('identityRequestCreator', () => {
    it('throws an invariant error', () => {
      global.console = { error: jest.fn() }
      const emptyRequest = new Request('')
      expect(
        identityRequestCreator()
      ).toEqual(
        emptyRequest
      )
      expect(console.error).toBeCalled()
    })
  })

  describe('identityResponder', () => {
    it('returns undefined for empty args', () => {
      expect(
        identityResponder()
      ).toEqual(
        undefined
      )
    })

    it('returns undefined with any payload and action', () => {
      const payload = {}
      const action = {}
      expect(
        identityResponder(payload, action)
      ).toEqual(
        undefined
      )
    })

    it('returns undefined with a proper payload and action', () => {
      const type = 'TEST_ACTION'
      const payload = new Request('')
      const action = { type }
      expect(
        identityResponder(payload, action)
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
