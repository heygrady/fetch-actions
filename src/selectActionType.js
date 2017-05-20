import get from 'lodash.get'

const selectActionType = action => get(action, 'type')
export default selectActionType
