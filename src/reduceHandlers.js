export const someFatalHandlers = (...handlers) => {
  return (error, action) => {
    let data
    handlers.some((handler) => {
      data = handler(error, action)
      return typeof data !== 'undefined'
    })
    return data
  }
}

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

const isTruthy = (something) => {
  return !!something
}

export const reduceConfigs = (fetch, ...configs) => {
  return {
    fatalHandler: someFatalHandlers(
      ...configs.map((c) => c.fatalHandler).filter(isTruthy)
    ),
    fetch,
    requestCreator: someRequestCreators(
      ...configs.map((c) => c.requestCreator).filter(isTruthy)
    ),
    responder: someResponders(
      ...configs.map((c) => c.responder).filter(isTruthy)
    ),
    responseHandler: reduceHandlers(
      ...configs.map((c) => c.responseHandler).filter(isTruthy)
    ),
    transformer: reduceHandlers(
      ...configs.map((c) => c.transformer).filter(isTruthy)
    ),
  }
}

const isPromise = (anything) => {
  return (
    typeof anything === 'object' &&
    !!anything &&
    typeof anything.then === 'function'
  )
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
