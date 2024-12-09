import { exec } from 'shipjs-lib';
import print from './print.mjs';
import exitProcess from './exitProcess.mjs';
import { error } from '../color.mjs';

export default ({
  command,
  dir,
  dryRun = false,
  printCommand = true,
  silent = false,
}) => {
  if (!dir) {
    throw new Error('`dir` is missing');
  }
  if (printCommand) {
    print(`$ ${command}`);
  }
  if (dryRun) {
    return;
  }
  const { code } = exec(command, { dir, silent });
  if (code !== 0) {
    if (printCommand) {
      print(error('The following command failed:'));
      print(`  > ${command}`);
    } else {
      print(error('Command failed'));
    }
    exitProcess(1);
  }
};
