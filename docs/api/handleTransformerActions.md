# handleTransformerActions

## Usage
```js
import createFetchAction, { handleTransformerActions } from 'fetch-actions'
import MY_ACTION from '../your-app/constants'
import 'fetch-everywhere'

const transformer = handleTransformerActions({
  [MY_ACTION]: (json, action) => {
    // transform a json response into data
    const data = {
      id: json.somePath.id, // <-- pull values from weird places
      attributes: {
        fullName: `${json.firstName}, ${json.lastName}`, // <-- glue values together
      }
    }
    return data // <-- return the data
  }
})

const fetchAction = createFetchAction({
  fetch,
  transformer
  // <-- add other handlers here
})

export fetchAction
```
