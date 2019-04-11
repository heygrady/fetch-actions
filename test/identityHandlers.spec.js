import {
  identityRequestCreator,
  identityResponder,
  identityHandler,
} from '../src/identityHandlers'
import 'cross-fetch/polyfill'

describe('identityHandlers', () => {
  describe('identityRequestCreator', () => {
    it('warns when request is empty', () => {
      global.console = { warn: jest.fn() }
      const emptyRequest = new Request('')
      expect(identityRequestCreator()).toEqual(emptyRequest)
      expect(console.warn).toBeCalled()
    })
  })

  describe('identityResponder', () => {
    it('returns undefined for empty args', () => {
      expect(identityResponder()).toBeUndefined()
    })

    it('returns undefined with any payload and action', () => {
      const payload = {}
      const action = {}
      expect(identityResponder(payload, action)).toBeUndefined()
    })

    it('returns undefined with a proper payload and action', () => {
      const type = 'TEST_ACTION'
      const payload = new Request('')
      const action = { type }
      expect(identityResponder(payload, action)).toBeUndefined()
    })
  })

  describe('identityHandler', () => {
    it('returns the payload unchanged', () => {
      const payload = {}
      expect(identityHandler(payload)).toEqual(payload)
    })
  })
})
