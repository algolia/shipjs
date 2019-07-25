import { exec } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import { info, error } from '../color';

// eslint-disable-next-line no-console
const print = console.log;

export default function run(command, dir, dryRun = false) {
  if (!dir) {
    throw new Error('`dir` is missing');
  }
  print('$', info(command));
  if (dryRun) {
    return;
  }
  const { code } = exec(command, { dir });
  if (code !== 0) {
    print(error('The following command failed:'));
    print(`  > ${command}`);
    process.exit(1); // eslint-disable-line no-process-exit
  }
}
