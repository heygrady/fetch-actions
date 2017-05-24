import { PREFIX } from './constants'

export default (action) => {
  // create a fetch request from this action
  return new Request(`${PREFIX}`)
}
