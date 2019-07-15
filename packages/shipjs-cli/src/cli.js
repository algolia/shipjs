import prepare from './flow/prepare';
import release from './flow/release';
import parseArgs from 'arg';
import { camelCase } from 'change-case';

const flowMap = {
  prepare,
  release,
};

function removeDoubleDash(opts) {
  return Object.entries(opts).reduce((acc, [key, value]) => {
    acc[camelCase(key)] = value;
    return acc;
  }, {});
}

export async function cli(argv) {
  const flowName = argv[2];
  const { fn, arg: argSpec } = flowMap[flowName];
  const opts = removeDoubleDash(
    parseArgs(argSpec, { permissive: false, argv })
  );
  await fn(opts);
}
