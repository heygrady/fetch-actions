const { TARGET_NODE_VERSION, MODULES_ENV, NODE_ENV } = process.env

const isEnvTest = NODE_ENV === 'test'
if (!isEnvTest) {
  // force production mode for package builds
  process.env.NODE_ENV = 'production'
}

const targetTest = isEnvTest
const targetCommonJS = MODULES_ENV === 'commonjs'
const targetESModules = MODULES_ENV === 'esmodules'
const targetBrowser = !targetCommonJS && !targetESModules
const nodeVersion = TARGET_NODE_VERSION || 8

module.exports = {
  presets: [
    // for testing with jest/jsdom
    targetTest && '@zumper/babel-preset-react-app/test',
    targetBrowser && ['@zumper/babel-preset-react-app', { helpers: false }],
    targetCommonJS && [
      '@zumper/babel-preset-react-app/commonjs',
      { helpers: false, nodeVersion },
    ],
    targetESModules && [
      '@zumper/babel-preset-react-app/esmodules',
      { helpers: false },
    ],
  ].filter(Boolean),
  plugins: [
    [require.resolve('babel-plugin-module-resolver'), { root: ['./src/'] }],
  ],
}
