const get = (obj, key, defaultValue) => {
  if (!obj || typeof obj[key] === 'undefined') {
    return defaultValue
  }
  return obj[key]
}

export const selectActionType = (action) => get(action, 'type')
