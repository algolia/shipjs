import setup from './flow/setup';
import prepare from './flow/prepare';
import release from './flow/release';
import parseArgs from 'arg';
import { camelCase } from 'change-case';
import { bold } from './color';
import { print } from './util';
import version from './version';

const flowMap = {
  setup,
  prepare,
  trigger: release,
};

function removeDoubleDash(opts) {
  return Object.entries(opts).reduce((acc, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    acc[camelCase(key)] = value;
    return acc;
  }, {});
}

function printVersion() {
  print(version);
  print('');
}

function printHelp() {
  print(bold('USAGE'));
  print(`\t${bold('shipjs setup')} --help`);
  print(`\t  : Setup Ship.js in your project.`);
  print('');
  print(`\t${bold('shipjs prepare')} --help`);
  print(`\t  : Prepare a release.`);
  print('');
  print(`\t${bold('shipjs trigger')} --help`);
  print(`\t  : Trigger the release.`);
  print('');
}

export async function cli(argv) {
  const flowName = argv[2];
  if ((flowName || '').trim() === '--version') {
    printVersion();
    return;
  }
  const { fn, arg: argSpec } = flowMap[flowName] || {};
  if (!fn) {
    printHelp();
    return;
  }
  const opts = removeDoubleDash(
    parseArgs(argSpec, { permissive: false, argv })
  );
  await fn(opts);
}
