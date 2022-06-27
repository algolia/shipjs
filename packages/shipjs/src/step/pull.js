import runStep from './runStep';
import { run } from '../util';

export default ({ remote, currentBranch, dir, dryRun, options }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({
      command: `git pull${
        options ? ` ${options.trim()}` : ''
      } ${remote} ${currentBranch}`,
      dir,
      dryRun,
    });
  });
