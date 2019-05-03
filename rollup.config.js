import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import camelCase from 'lodash.camelcase'
import kebabCase from 'lodash.kebabcase'
import upperFirst from 'lodash.upperfirst'

import pkg from './package.json'

const { MODULES_ENV } = process.env

const targetCommonJS = MODULES_ENV === 'commonjs'
const targetESModules = MODULES_ENV === 'esmodules'
const targetBrowser = !targetCommonJS && !targetESModules

const input = 'src/index.js'
const globalName = upperFirst(camelCase(pkg.name))
const fileName = kebabCase(pkg.name)

// specify all dependencies as external
let deps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]
if (targetBrowser) {
  const embeddedModules = new Set([
    '@babel/runtime',
    'tiny-invariant',
    'tiny-warning',
  ])
  deps = deps.filter((key) => !embeddedModules.has(key))
}
const external = (name) => deps.some((dep) => name.startsWith(dep))
const globals = {
  // add external UMD package names here...
  // react: 'React',
  // 'prop-types': 'PropTypes',
}

const createConfig = (format, env = 'production') => {
  const isEnvProduction = env === 'production'
  let file
  if (format === 'iife' || format === 'umd') {
    file = `dist/${fileName}${isEnvProduction ? '.min' : ''}.js`
  } else if (format === 'cjs') {
    file = `lib/${fileName}.js`
  } else if (format === 'esm') {
    file = `es/${fileName}.js`
  }
  return {
    input,
    output: {
      file,
      format,
      name: globalName,
      indent: false,
      exports: 'named',
      globals,
    },
    external,
    plugins: [
      nodeResolve({
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
        customResolveOptions: {
          moduleDirectory: ['node_modules', 'src'],
        },
      }),
      commonjs(),
      babel(),
      replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
      isEnvProduction &&
        (format === 'iife' || format === 'umd') &&
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }),
    ].filter(Boolean),
  }
}

export default [
  targetBrowser && createConfig('umd', 'development'),
  targetBrowser && createConfig('umd'),
  targetCommonJS && createConfig('cjs'),
  targetESModules && createConfig('esm'),
].filter(Boolean)
