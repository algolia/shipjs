import tempWrite from 'temp-write';
import runStep from '../runStep';
import { wrapExecWithDir, run, print } from '../../util';
import { info } from '../../color';

export default async ({
  nextVersion,
  releaseType,
  dir,
  config,
  baseBranch,
  dryRun,
}) =>
  await runStep({ title: 'Committing the changes.' }, async () => {
    const { formatCommitMessage, beforeCommitChanges } = config;
    const message = formatCommitMessage({
      version: nextVersion,
      releaseType,
      baseBranch,
    });
    if (dryRun) {
      print('$', info('git add .'));
      print('$', info('git commit'));
      print('  |');
      print(`  | ${message}`);
      print('  |');
      return;
    }
    if (beforeCommitChanges) {
      await beforeCommitChanges({
        nextVersion,
        releaseType,
        exec: wrapExecWithDir(dir),
        dir,
      });
    }
    const filePath = tempWrite.sync(message);
    run({ command: 'git add .', dir });
    run({ command: `git commit --file=${filePath}`, dir });
  });
