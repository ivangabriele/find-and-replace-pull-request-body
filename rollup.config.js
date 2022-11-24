import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

export default [
  {
    input: './index.js',

    output: {
      file: './index.dist.js',
      format: 'es',
    },

    plugins: [nodeResolve(), commonjs(), json()],
  },
]
