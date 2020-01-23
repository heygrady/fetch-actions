import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import * as fs from 'fs-extra'
import camelCase from 'lodash/camelCase'
import kebabCase from 'lodash/kebabCase'
import upperFirst from 'lodash/upperFirst'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const input = fs.existsSync('src/index.ts') ? 'src/index.ts' : 'src/index.js'
const globalName = upperFirst(camelCase(pkg.name))
const fileName = kebabCase(pkg.name)

const embedded = new Set(['@babel/runtime', 'tiny-invariant', 'tiny-warning'])
const deps = [
  ...Object.keys(pkg.dependencies || {}).filter((key) => !embedded.has(key)),
  ...Object.keys(pkg.peerDependencies || {}),
]
const external = (name) => deps.some((dep) => name.startsWith(dep))
const globals = {
  // ... add other external UMD package names here
}

const createConfig = (env) => {
  const isEnvProduction = env === 'production'
  return {
    input,
    output: {
      file: `dist/${fileName}${isEnvProduction ? '.min' : ''}.js`,
      format: 'umd',
      name: globalName,
      indent: false,
      exports: 'named',
      globals,
    },
    external,
    plugins: [
      nodeResolve({
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
        customResolveOptions: { moduleDirectory: ['node_modules', 'src'] },
      }),
      commonjs(),
      babel(),
      replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
      isEnvProduction &&
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

// eslint-disable-next-line import/no-default-export
export default [
  // UMD Development
  createConfig('development'),
  // UMD Production
  createConfig('production'),
]
