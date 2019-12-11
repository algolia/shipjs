import path from 'path';
import dotenv from 'dotenv';
import setup from './flow/setup';
import prepare from './flow/prepare';
import release from './flow/release';
import { bold } from './color';
import { print, parseArgs } from './util';
import version from './version';

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
