export const someRequestCreators = (...handlers) => {
  return (action) => {
    let request
    handlers.some((handler) => {
      request = handler(action)
      return !!request
    })
    return request
  }
}

export const someResponders = (...handlers) => {
  return (request, action) => {
    let response
    handlers.some((handler) => {
      response = handler(request, action)
      return !!response
    })
    return response
  }
}

const isPromise = (anything) => {
  return typeof anything === 'object' &&
    !!anything &&
    typeof anything.then === 'function'
}

const reduceHandlers = (...handlers) => {
  return (state, action) =>
    handlers.reduce((state, handler) => {
      if (isPromise(state)) {
        return state.then((resolvedState) => handler(resolvedState, action))
      }
      return handler(state, action)
    }, state)
}
export default reduceHandlers
