export const someFetchHandlers = (...handlers) => {
  return action => {
    let request
    handlers.some(handler => {
      request = handler(action)
      return !!request
    })
    return request
  }
}

export const someRequestHandlers = (...handlers) => {
  return (request, action) => {
    let response
    handlers.some(handler => {
      response = handler(request, action)
      return !!response
    })
    return response
  }
}

const reduceHandlers = (...handlers) => {
  return (state, action) => handlers.reduce(
    (state, handler) => handler(state, action),
    state
  )
}
export default reduceHandlers
