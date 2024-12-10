import arg from 'arg';
import { camelCase } from 'change-case';

export default function parseArgs(argSpec, argv) {
  return camelizeKeys(arg(argSpec, { permissive: false, argv }));
}

function camelizeKeys(opts) {
  return Object.entries(opts).reduce((acc, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    acc[camelCase(key)] = value;
    return acc;
  }, {});
}
