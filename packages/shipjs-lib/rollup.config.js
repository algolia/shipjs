import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const onwarn = warning => {
  // Silence circular dependency warning for moment package
  if (
    warning.code === 'CIRCULAR_DEPENDENCY' &&
    [
      '../../node_modules/glob/glob.js',
      '../../node_modules/shelljs/shell.js',
    ].includes(warning.importer)
  ) {
    return;
  }

  // eslint-disable-next-line no-console
  console.warn(`(!) ${warning.message}`);
};

export default [
  {
    onwarn,
    input: 'src/index.js',
    output: [{ file: pkg.main, format: 'es' }],
    external: [
      'fs',
      'path',
      'os',
      'events',
      'assert',
      'util',
      'child_process',
      'stream',
    ],
    plugins: [resolve({ preferBuiltins: true }), commonjs()],
  },
];
