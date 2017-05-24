# Example of using `fetch-actions` with `react-redux-starter-kit`
This is the example documentation for integrating `fetch-actions` with `react-redux-starter-kit`. It should be easy to integrate fetch-actions with any starter kit and pull requests are welcome for examples.

This tutorial was written using this version of the starter kit, it may have changed since it was last written. This folder should be kept up to date with the latest version should people care to keep the content updated. Even if the information is slightly out of the date, this is primarily to elaborate on core technique. Using a common starter-kit is intended to answer mundane questions like how to get the basics of react and redux working and instead focus on how to set up redux-saga and fetch-action to make the counter example that ships with the starter kit sync with the server.

The first version of this will be a step-by-step. This may be truncated in the future to keep the most relevant parts of the process in focus.

## Download the starter-kit
Make a new folder and clone the repo. In this case we're using `examples/react-redux-starter-kit`. You may choose any arbitrary name.

```bash
mkdir -p examples/react-redux-starter-kit
cd examples/react-redux-starter-kit
git clone https://github.com/davezuko/react-redux-starter-kit.git .
yarn install

# to make this repo we removed some extra files
# this isn't strictly necessary
rm -drf .git
rm -drf README.md
```

**TODO:** add a .gitignore that only includes files that have been changed.
**TODO:** add a script that automates the merge from the latest starter-kit

## Install redux-saga and redux-saga-watch-actions

```bash
yarn add redux-saga redux-saga-watch-actions
```

```js
// store/sagas.js

```

## Link up fetch-actions

```bash
yarn add fetch-actions

# to make this repo we import locally for testing
# import createFetchAction from '../../src'
```

## Set up a saga for the counter
