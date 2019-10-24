export const someFatalHandlers = (...handlers) => {
  return (error, action) => {
    return handlers.reduce((data, handler) => {
      if (typeof data !== 'undefined') {
        if (isPromise(data)) {
          return data
            .catch((rejection) => {
              error = rejection
            })
            .then((resolvedData) => {
              if (typeof resolvedData !== 'undefined') {
                return resolvedData
              }
              return handler(error, action)
            })
        }
        return data
      }
      try {
        return handler(error, action)
      } catch (newError) {
        error = newError
        return undefined
      }
    }, undefined)
  }
}

export const someRequestCreators = (...handlers) => {
  return (action) => {
    return handlers.reduce((request, handler) => {
      if (request) {
        if (isPromise(request)) {
          return request.then((resolvedRequest) => {
            if (resolvedRequest) {
              return resolvedRequest
            }
            return handler(action)
          })
        }
        return request
      }
      return handler(action)
    }, undefined)
  }
}

export const someResponders = (...handlers) => {
  return (request, action) => {
    return handlers.reduce((response, handler) => {
      if (response) {
        if (isPromise(response)) {
          return response.then((resolvedResponse) => {
            if (resolvedResponse) {
              return resolvedResponse
            }
            return handler(request, action)
          })
        }
        return response
      }
      return handler(request, action)
    }, undefined)
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
