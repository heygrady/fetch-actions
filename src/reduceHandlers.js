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

export const reduceConfigs = (fetch, ...configs) => {
  return {
    fatalHandler: someFatalHandlers(
      ...configs.map((c) => c.fatalHandler).filter(Boolean)
    ),
    fetch,
    finally: reduceFinallies(...configs.map((c) => c.finally).filter(Boolean)),
    requestCreator: someRequestCreators(
      ...configs.map((c) => c.requestCreator).filter(Boolean)
    ),
    requestTransformer: reduceHandlers(
      ...configs.map((c) => c.requestTransformer).filter(Boolean)
    ),
    responder: someResponders(
      ...configs.map((c) => c.responder).filter(Boolean)
    ),
    responseHandler: reduceHandlers(
      ...configs.map((c) => c.responseHandler).filter(Boolean)
    ),
    transformer: reduceHandlers(
      ...configs.map((c) => c.transformer).filter(Boolean)
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

export const reduceFinallies = (...finallies) => {
  return (action, errored) => {
    return finallies.reduce((promise, handler) => {
      if (isPromise(promise)) {
        return promise.then(() => handler(action, errored))
      }
      return handler(action, errored)
    }, undefined)
  }
}

export const reduceHandlers = (...handlers) => {
  return (state, action) =>
    handlers.reduce((state, handler) => {
      if (isPromise(state)) {
        return state.then((resolvedState) => handler(resolvedState, action))
      }
      return handler(state, action)
    }, state)
}
