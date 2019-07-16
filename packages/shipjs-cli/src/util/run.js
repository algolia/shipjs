import { exec } from 'shipjs-lib';
import { info, error } from '../color';

export default function run(command, dir) {
  if (!dir) {
    throw new Error('`dir` is missing');
  }
  console.log('$', info(command));
  const { code } = exec(command, { dir });
  if (code !== 0) {
    console.log(error('The following command failed:'));
    console.log(`  > ${command}`);
    process.exit(1);
  }
}
