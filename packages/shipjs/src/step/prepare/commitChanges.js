import tempWrite from 'temp-write';

import { info } from '../../color.js';
import { wrapExecWithDir, run, print } from '../../util/index.js';
import runStep from '../runStep.js';

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
