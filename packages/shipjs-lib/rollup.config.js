import { createRequire } from 'module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  {
    input: 'src/index.js',
    output: [{ file: pkg.main, format: 'es' }],
    external: ['fs', 'path', 'url'].concat(Object.keys(pkg.dependencies)),
    plugins: [resolve({ preferBuiltins: true }), commonjs()],
  },
];
