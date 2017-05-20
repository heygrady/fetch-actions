import { Request } from 'fetch-everywhere'
export const IDENTITY_FETCH_HANDLER_WARNING = '@@fetch-actions/IDENTITY_FETCH_HANDLER_WARNING'

export const identityFetchHandler = (payload, action) => {
  console.warn(IDENTITY_FETCH_HANDLER_WARNING)
  return new Request()
}
export const identityRequestHandler = (payload, action) => undefined
export const identityHandler = (payload, action) => payload
