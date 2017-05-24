import requestHandlers from './requestHandlers'

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export const mock = response => {
  const duration = __TEST__ ? 0 : getRandomInt(40, 2000)
  const resolve = resolve => setTimeout(() => resolve(response), duration)
  return new Promise(resolve)
}

export default (request, action) => {
  const response = requestHandlers(request, action)
  return mock(response)
}
