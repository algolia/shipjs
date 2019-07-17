import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const onwarn = warning => {
  // Silence circular dependency warning for moment package
  if (
    warning.code === 'CIRCULAR_DEPENDENCY' &&
    [
      '../../node_modules/readable-stream/lib/_stream_readable.js',
      '../../node_modules/readable-stream/lib/_stream_duplex.js',
      '../../node_modules/conventional-commits-parser/node_modules/readable-stream/lib/_stream_readable.js',
      '../../node_modules/conventional-commits-parser/node_modules/readable-stream/lib/_stream_duplex.js',
      '../../node_modules/conventional-changelog-writer/node_modules/readable-stream/lib/_stream_readable.js',
      '../../node_modules/conventional-changelog-writer/node_modules/readable-stream/lib/_stream_duplex.js',
      '../../node_modules/conventional-changelog-core/node_modules/readable-stream/lib/_stream_readable.js',
      '../../node_modules/conventional-changelog-core/node_modules/readable-stream/lib/_stream_duplex.js',
      '../../node_modules/conventional-changelog-core/node_modules/readable-stream/lib/_stream_readable.js',
      '../../node_modules/glob/glob.js',
    ].includes(warning.importer)
  ) {
    return;
  }

  console.warn(`(!) ${warning.message}`);
};

export default [
  {
    onwarn,
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
      'url',
    ],
    plugins: [resolve({ preferBuiltins: true }), json(), commonjs()],
  },
];
