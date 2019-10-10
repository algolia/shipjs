import tempWrite from 'temp-write';
import runStep from '../runStep';
import wrapExecWithDir from '../../util/wrapExecWithDir';

export default async ({ nextVersion, dir, config, baseBranch, dryRun }) =>
  await runStep(
    { title: 'Committing the changes.' },
    async ({ print, info, run }) => {
      const {
        formatCommitMessage,
        mergeStrategy,
        beforeCommitChanges,
      } = config;
      const message = formatCommitMessage({
        version: nextVersion,
        mergeStrategy,
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
      await beforeCommitChanges({ exec: wrapExecWithDir(dir), dir });
      const filePath = tempWrite.sync(message);
      run({ command: 'git add .', dir });
      run({ command: `git commit --file=${filePath}`, dir });
    }
  );
