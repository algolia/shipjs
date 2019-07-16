import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    external: ['fs', 'path', 'os', 'events', 'assert', 'util'],
    plugins: [resolve({ preferBuiltins: true }), commonjs()],
  },
];
