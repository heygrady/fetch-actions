import warning from 'warning'

export const identityFetchHandler = action => {
  warning(false, '@@fetch-actions/identityFetchHandler you should define a fetchHandler for all actions. The identity fetch handler generates blank requests.')
  return new Request('')
}
export const identityRequestHandler = (payload, action) => undefined
export const identityHandler = (payload, action) => payload
