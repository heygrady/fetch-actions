import createFetchAction from './createFetchAction'
import handleFetchAction from './handleFetchAction'
import handleRequestAction from './handleRequestAction'
import handleResponseAction from './handleResponseAction'
import handleTransformAction from './handleTransformAction'
import identityHandlers from './identityHandlers'
import selectActionType from './selectActionType'
import warning from './utils/warning'

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed () {}

if (
  process.env.NODE_ENV !== 'production' &&
  typeof isCrushed.name === 'string' &&
  isCrushed.name !== 'isCrushed'
) {
  warning(
    'You are currently using minified code outside of NODE_ENV === \'production\'. ' +
    'This means that you are running a slower development build of Fetch Actions. ' +
    'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
    'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' +
    'to ensure you have the correct code for your production build.'
  )
}

export {
  createFetchAction,
  handleFetchAction,
  handleRequestAction,
  handleResponseAction,
  handleTransformAction,
  identityHandlers,
  selectActionType
}
