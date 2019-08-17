import tempWrite from 'temp-write';
import runStep from '../runStep';
import wrapExecWithDir from '../../util/wrapExecWithDir';

export default async ({ nextVersion, dir, config, dryRun }) =>
  await runStep(
    { title: 'Committing the changes.' },
    async ({ print, info, run }) => {
      const { formatCommitMessage, beforeCommitChanges } = config;
      const message = formatCommitMessage({ nextVersion });
      if (dryRun) {
        print('$', info('git add .'));
        print('$', info('git commit'));
        print(`  git commit message: ${message}`);
        return;
      }
      await beforeCommitChanges({ exec: wrapExecWithDir(dir) });
      const filePath = tempWrite.sync(message);
      run('git add .', dir);
      run(`git commit --file=${filePath}`, dir);
    }
  );
