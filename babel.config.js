const { TARGET_NODE_VERSION, MODULES_ENV, NODE_ENV } = process.env

const isEnvTest = NODE_ENV === 'test'
if (!isEnvTest) {
  // force production mode for package builds
  process.env.NODE_ENV = 'production'
}

const useCommonJS = MODULES_ENV === 'commonjs'
const useESModules = MODULES_ENV === 'esmodules'
const useUMD = !useCommonJS && !useESModules
const nodeVersion = TARGET_NODE_VERSION || 8

module.exports = {
  presets: [
    // for testing with jest/jsdom
    isEnvTest && '@zumper/babel-preset-react-app/test',
    // for rollup
    useUMD && ['@zumper/babel-preset-react-app', { helpers: false }],
    useCommonJS && [
      '@zumper/babel-preset-react-app/commonjs',
      { helpers: false, nodeVersion },
    ],
    useESModules && [
      '@zumper/babel-preset-react-app/esmodules',
      { helpers: false },
    ],
  ].filter(Boolean),
  plugins: [
    [require.resolve('babel-plugin-module-resolver'), { root: ['./src/'] }],
  ],
}
