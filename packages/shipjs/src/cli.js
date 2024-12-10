import path from 'path';
import dotenv from 'dotenv';
import setup from './flow/setup.js';
import prepare from './flow/prepare.js';
import release from './flow/release.js';
import { bold } from './color.js';
import { print, parseArgs } from './util/index.js';
import version from './version.js';

const flowMap = {
  setup,
  prepare,
  trigger: release,
};

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
  try {
    const opts = parseArgs(argSpec, argv);
    dotenv.config({ path: path.resolve(opts.dir || '.', '.env') });
    await fn(opts);
  } catch (error) {
    if (error.code === 'ARG_UNKNOWN_OPTION') {
      print(error);
    } else {
      throw error;
    }
  }
}
