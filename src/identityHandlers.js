import warning from 'warning'

export const identityRequestCreator = action => {
  warning(false, '@@fetch-actions/identityRequestCreator you should define a requestCreator for all actions. The identity fetch handler generates blank requests.')
  return new Request('')
}
export const identityResponder = (payload, action) => undefined
export const identityHandler = (payload, action) => payload
