import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default [
  {
    input: 'src/index.mjs',
    output: [{ file: pkg.main, format: 'es' }],
    external: ['fs', 'path', 'url'].concat(Object.keys(pkg.dependencies)),
    plugins: [resolve({ preferBuiltins: true }), commonjs()],
  },
];
