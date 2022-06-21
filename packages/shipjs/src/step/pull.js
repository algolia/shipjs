import runStep from './runStep';
import { run } from '../util';

export default ({ remote, currentBranch, dir, dryRun, rebase = false }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({
      command: `git pull${
        rebase ? ' --rebase' : ''
      } ${remote} ${currentBranch}`,
      dir,
      dryRun,
    });
  });
