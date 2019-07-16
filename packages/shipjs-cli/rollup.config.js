import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  {
    input: 'bin/src/index.js',
    output: [
      { file: pkg.bin.ship, format: 'cjs', banner: '#!/usr/bin/env node' },
    ],
    external: [
      'path',
      'fs',
      'util',
      'os',
      'events',
      'assert',
      'readline',
      'constants',
      'stream',
      'child_process',
      'crypto',
      'tty',
      'buffer',
      'string_decoder',
    ],
    plugins: [resolve({ preferBuiltins: true }), json(), commonjs()],
  },
];
